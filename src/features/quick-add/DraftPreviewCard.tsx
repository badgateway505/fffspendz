import { useState, useEffect } from 'react';
import type { ParsedSpend, Currency, CategoryKey } from '../../domain/expense.types';

// SECTION: props
interface DraftPreviewCardProps {
  parsed: ParsedSpend | null;
  onSave: (data: {
    amount: number;
    currency: Currency;
    merchant: string;
    note?: string;
    categoryKey?: CategoryKey | string;
  }) => void;
  onCancel: () => void;
}

// SECTION: rendering
export function DraftPreviewCard({ parsed, onSave, onCancel }: DraftPreviewCardProps) {
  // SECTION: state
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('THB');
  const [merchant, setMerchant] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [categoryKey, setCategoryKey] = useState<CategoryKey | string>('');

  // SECTION: effects
  // Update form when parsed data changes
  useEffect(() => {
    if (parsed) {
      setAmount(parsed.amount?.toString() || '');
      setCurrency(parsed.currency || 'THB');
      setMerchant(parsed.merchant || '');
      setNote(parsed.note || '');
      setCategoryKey(parsed.groupGuess || '');
    }
  }, [parsed]);

  // SECTION: events
  const handleSave = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return; // Invalid amount
    }
    if (!merchant.trim()) {
      return; // Merchant is required
    }

    onSave({
      amount: amountNum,
      currency,
      merchant: merchant.trim(),
      note: note.trim() || undefined,
      categoryKey: categoryKey || undefined,
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!parsed) {
    return null;
  }

  const isValid = parseFloat(amount) > 0 && merchant.trim().length > 0;

  return (
    <div className="rounded-xl border border-mint/30 bg-ink-900/60 p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Preview & Edit</h3>
          {parsed.confidence !== undefined && (
            <p className="text-xs text-ink-400">
              Confidence: {Math.round(parsed.confidence * 100)}%
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Amount and Currency */}
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-300">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-ink-800/50 px-3 py-2 text-ink-200 placeholder:text-ink-500 focus:border-mint/50 focus:outline-none focus:ring-2 focus:ring-mint/20"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-300">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="rounded-lg border border-white/10 bg-ink-800/50 px-3 py-2 text-ink-200 focus:border-mint/50 focus:outline-none focus:ring-2 focus:ring-mint/20"
            >
              <option value="THB">THB</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Merchant */}
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-300">Merchant</label>
          <input
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-ink-800/50 px-3 py-2 text-ink-200 placeholder:text-ink-500 focus:border-mint/50 focus:outline-none focus:ring-2 focus:ring-mint/20"
            placeholder="Merchant name"
          />
        </div>

        {/* Note */}
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-300">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-ink-800/50 px-3 py-2 text-ink-200 placeholder:text-ink-500 focus:border-mint/50 focus:outline-none focus:ring-2 focus:ring-mint/20"
            placeholder="Additional notes"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-300">Category</label>
          <select
            value={categoryKey}
            onChange={(e) => setCategoryKey(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-ink-800/50 px-3 py-2 text-ink-200 focus:border-mint/50 focus:outline-none focus:ring-2 focus:ring-mint/20"
          >
            <option value="">None</option>
            <option value="food">Food</option>
            <option value="fun">Fun</option>
            <option value="bills">Bills</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-lg border border-white/20 bg-ink-700/50 px-4 py-2 text-sm font-medium text-ink-200 transition hover:bg-ink-700/70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="flex-1 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink-900 transition hover:bg-mint/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

