// TYPES:
export type Currency = 'THB' | 'EUR';

export type CategoryKey = 'food' | 'fun' | 'bills';

export interface Category {
  id: string;
  key: CategoryKey | string;
  label: string;
  color?: string;
}

export interface Expense {
  id: string;
  amount: number;
  currency: Currency;
  merchant: string;
  note?: string;
  categoryId?: string;
  occurredAt: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface NewExpenseInput {
  amount: number;
  currency: Currency;
  merchant: string;
  note?: string;
  categoryId?: string;
  occurredAt?: string;
}

export interface Settings {
  mainCurrency: Currency;
  categories: Category[];
}

export interface ParsedSpend {
  rawText: string;
  amount?: number;
  currency?: Currency;
  merchant?: string;
  note?: string;
  groupGuess?: CategoryKey | string;
  confidence?: number; // 0-1 for parser guess quality
}