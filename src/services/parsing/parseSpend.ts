import type { ParsedSpend, Currency, CategoryKey } from '../../domain/expense.types';

// HELPERS:

/**
 * Escapes special regex characters in a string so it can be safely used in a RegExp.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts amount from text, looking for numbers with optional currency indicators.
 * Returns the first significant number found (typically the amount).
 */
function extractAmount(text: string): number | undefined {
  // Match numbers with optional thousands separators (commas, spaces)
  // Also match numbers followed by currency words
  const patterns = [
    /(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(?:baht|thb|eur|euro|bath)/i,
    /(?:baht|thb|eur|euro|bath)\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/i,
    /\b(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const amountStr = match[1].replace(/[,\s]/g, '');
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }

  return undefined;
}

/**
 * Extracts currency from text. Defaults to THB for MVP.
 * Looks for currency indicators: baht, thb, eur, euro.
 */
function extractCurrency(text: string): Currency | undefined {
  const lowerText = text.toLowerCase();
  
  if (/\b(eur|euro)\b/.test(lowerText)) {
    return 'EUR';
  }
  
  // THB is default for MVP, but check for explicit indicators
  if (/\b(baht|thb|bath)\b/.test(lowerText)) {
    return 'THB';
  }
  
  // Default to THB for MVP if amount is found but no currency specified
  return 'THB';
}

/**
 * Guesses category/group based on keywords in the text.
 * Returns CategoryKey or undefined if no match.
 */
function guessCategory(text: string): CategoryKey | string | undefined {
  const lowerText = text.toLowerCase();
  
  // Food-related keywords
  const foodKeywords = [
    'food', 'restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast',
    'bbq', 'burger', 'pizza', 'pasta', 'sushi', 'thai', 'chinese', 'indian',
    'meal', 'eat', 'dining', 'takeout', 'delivery', 'grocery', 'supermarket',
    'market', 'ribs', 'steak', 'chicken', 'fish', 'vegetable', 'fruit',
  ];
  
  // Fun/entertainment keywords
  const funKeywords = [
    'fun', 'entertainment', 'movie', 'cinema', 'theater', 'concert', 'show',
    'game', 'gaming', 'arcade', 'bowling', 'karaoke', 'bar', 'pub', 'club',
    'drink', 'beer', 'wine', 'cocktail', 'party', 'event', 'festival',
    'amusement', 'park', 'zoo', 'museum', 'gallery', 'sport', 'gym', 'fitness',
  ];
  
  // Bills/utilities keywords
  const billsKeywords = [
    'bill', 'bills', 'utility', 'electric', 'electricity', 'water', 'gas',
    'internet', 'wifi', 'phone', 'mobile', 'rent', 'mortgage', 'insurance',
    'tax', 'subscription', 'netflix', 'spotify', 'youtube', 'premium',
    'service', 'maintenance', 'repair', 'fuel', 'petrol', 'diesel',
  ];
  
  // Check for matches (case-insensitive)
  for (const keyword of foodKeywords) {
    if (lowerText.includes(keyword)) {
      return 'food';
    }
  }
  
  for (const keyword of funKeywords) {
    if (lowerText.includes(keyword)) {
      return 'fun';
    }
  }
  
  for (const keyword of billsKeywords) {
    if (lowerText.includes(keyword)) {
      return 'bills';
    }
  }
  
  return undefined;
}

/**
 * Extracts merchant name from text.
 * Tries to identify the merchant (usually a business name or location).
 * This is heuristic: looks for capitalized words or common merchant patterns.
 */
function extractMerchant(text: string, amountWordIndex: number): string | undefined {
  // Split text into words
  const words = text.trim().split(/\s+/);
  
  // Strategy 1: Words before the amount (if amount position is known)
  if (amountWordIndex > 0) {
    const beforeAmount = words.slice(0, amountWordIndex);
    // Take up to 3 words before amount as potential merchant
    const candidate = beforeAmount.slice(-3).join(' ').trim();
    if (candidate && candidate.length > 1) {
      return candidate;
    }
  }
  
  // Strategy 2: First few capitalized words (common merchant pattern)
  const merchantWords: string[] = [];
  for (let i = 0; i < Math.min(3, words.length); i++) {
    const word = words[i];
    // Skip if it's a number or very short
    if (word && word.length > 2 && !/^\d+$/.test(word)) {
      merchantWords.push(word);
    }
  }
  
  if (merchantWords.length > 0) {
    return merchantWords.join(' ');
  }
  
  return undefined;
}

/**
 * Extracts note/description from text.
 * Usually the remaining text after removing amount, currency, and merchant.
 */
function extractNote(text: string, amount: number | undefined, merchant: string | undefined): string | undefined {
  let note = text.trim();
  
  // Remove amount if found
  if (amount !== undefined) {
    const escapedAmount = escapeRegex(amount.toString());
    note = note.replace(new RegExp(`\\b${escapedAmount}\\b`, 'g'), '').trim();
  }
  
  // Remove currency words
  note = note.replace(/\b(baht|thb|eur|euro|bath)\b/gi, '').trim();
  
  // Remove merchant if found
  if (merchant) {
    const merchantWords = merchant.split(/\s+/);
    for (const word of merchantWords) {
      const escapedWord = escapeRegex(word);
      note = note.replace(new RegExp(`\\b${escapedWord}\\b`, 'gi'), '').trim();
    }
  }
  
  // Clean up extra spaces
  note = note.replace(/\s+/g, ' ').trim();
  
  return note.length > 0 ? note : undefined;
}

/**
 * Calculates confidence score (0-1) based on how many fields were successfully extracted.
 */
function calculateConfidence(parsed: ParsedSpend): number {
  let score = 0;
  let maxScore = 0;
  
  // Amount is critical
  maxScore += 2;
  if (parsed.amount !== undefined) score += 2;
  
  // Currency is important
  maxScore += 1;
  if (parsed.currency !== undefined) score += 1;
  
  // Merchant is helpful
  maxScore += 1;
  if (parsed.merchant !== undefined) score += 1;
  
  // Note is optional
  maxScore += 0.5;
  if (parsed.note !== undefined) score += 0.5;
  
  // Category guess is helpful
  maxScore += 0.5;
  if (parsed.groupGuess !== undefined) score += 0.5;
  
  return maxScore > 0 ? Math.min(1, score / maxScore) : 0;
}

// API:

/**
 * Parses free-form text input to extract expense information.
 * Uses heuristic patterns to identify amount, currency, merchant, note, and category.
 * 
 * @param text - Raw text input (e.g., "bbq hogfather 1200 baht ribs with Dasha")
 * @returns ParsedSpend object with extracted fields and confidence score
 * 
 * @example
 * parseSpend("bbq hogfather 1200 baht ribs with Dasha")
 * // Returns: { rawText: "...", amount: 1200, currency: "THB", merchant: "bbq hogfather", note: "ribs with Dasha", groupGuess: "food", confidence: 0.9 }
 */
export function parseSpend(text: string): ParsedSpend {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      rawText: text,
      confidence: 0,
    };
  }
  
  const normalizedText = text.trim();
  
  // Extract amount first (needed for merchant extraction)
  const amount = extractAmount(normalizedText);
  
  // Find word index of amount for merchant extraction
  const words = normalizedText.split(/\s+/);
  let amountWordIndex = -1;
  if (amount !== undefined) {
    const amountStr = amount.toString();
    for (let i = 0; i < words.length; i++) {
      if (words[i].replace(/[,\s]/g, '').includes(amountStr)) {
        amountWordIndex = i;
        break;
      }
    }
  }
  
  // Extract other fields
  const currency = extractCurrency(normalizedText);
  const merchant = extractMerchant(normalizedText, amountWordIndex);
  const note = extractNote(normalizedText, amount, merchant);
  const groupGuess = guessCategory(normalizedText);
  
  const parsed: ParsedSpend = {
    rawText: normalizedText,
    amount,
    currency,
    merchant,
    note,
    groupGuess,
  };
  
  // Calculate confidence
  parsed.confidence = calculateConfidence(parsed);
  
  return parsed;
}

