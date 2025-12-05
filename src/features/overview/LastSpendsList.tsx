import { useMemo } from 'react';
import { useExpensesStore } from '../../state/expenses.store';

interface LastSpendsListProps {
  limit?: number;
}

export function LastSpendsList({ limit = 5 }: LastSpendsListProps) {
  const expenses = useExpensesStore((state) => state.expenses);

  const recent = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, limit);
  }, [expenses, limit]);

  if (recent.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-ink-900/40 p-4 text-ink-300">
        No spends yet. Your last 5 will appear here once you add them.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recent.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-900/40 p-4 shadow-sm shadow-ink-900/40"
        >
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
      ))}
    </div>
  );
}

export default LastSpendsList;
