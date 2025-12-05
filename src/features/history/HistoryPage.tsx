import { useMemo } from 'react';
import { useExpensesStore } from '../../state/expenses.store';

export function HistoryPage() {
  const expenses = useExpensesStore((state) => state.expenses);

  const sorted = useMemo(
    () => [...expenses].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()),
    [expenses]
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-ink-700/60 p-6 text-ink-300">
        No spends yet. Add your first expense to see it here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((expense) => (
        <div
          key={expense.id}
          className="rounded-2xl border border-white/10 bg-ink-900/50 p-4 shadow-sm shadow-ink-900/40"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{expense.merchant || 'Unknown merchant'}</p>
              <p className="text-xs text-ink-400">
                {new Date(expense.occurredAt).toLocaleDateString()} · {expense.note || 'No note'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-sunshine">
                {expense.amount.toLocaleString(undefined, { minimumFractionDigits: 0 })} {expense.currency}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistoryPage;
