import { useMemo } from 'react';
import { useExpensesStore } from '../../state/expenses.store';
import { useSettingsStore } from '../../state/settings.store';
import { useCategoriesStore } from '../../state/categories.store';

type WindowOption = '7d' | '30d';

interface AnalyticsSummaryProps {
  window?: WindowOption;
}

function getWindowDates(window: WindowOption): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);
  const days = window === '30d' ? 30 : 7;
  start.setDate(end.getDate() - days + 1);
  return { start, end };
}

export function AnalyticsSummary({ window = '7d' }: AnalyticsSummaryProps) {
  const expenses = useExpensesStore((state) => state.expenses);
  const mainCurrency = useSettingsStore((state) => state.settings.mainCurrency);
  const categories = useCategoriesStore((state) => state.categories);

  const { total, byGroup } = useMemo(() => {
    const { start, end } = getWindowDates(window);
    const inWindow = expenses.filter((expense) => {
      const occurred = new Date(expense.occurredAt);
      return (
        occurred >= start &&
        occurred <= end &&
        expense.currency === mainCurrency
      );
    });

    const sum = inWindow.reduce((acc, expense) => acc + expense.amount, 0);

    const groupTotals: Record<string, number> = {};
    inWindow.forEach((expense) => {
      const category = categories.find((cat) => cat.id === expense.categoryId);
      const key = category?.label || 'Uncategorized';
      groupTotals[key] = (groupTotals[key] || 0) + expense.amount;
    });

    return { total: sum, byGroup: groupTotals };
  }, [expenses, categories, mainCurrency, window]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-5 shadow-lg shadow-ink-900/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-mint">Analytics</p>
            <h3 className="font-display text-xl font-semibold text-white">
              Last {window === '30d' ? '30' : '7'} days
            </h3>
          </div>
          <div className="rounded-full bg-ink-700/80 px-3 py-1 text-xs font-semibold text-ink-200">
            {mainCurrency}
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold text-sunshine">
          {total.toLocaleString(undefined, { minimumFractionDigits: 0 })} {mainCurrency}
        </p>
        <p className="text-sm text-ink-400">Total spend</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-4 shadow-lg shadow-ink-900/40">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
          By group
        </p>
        {Object.keys(byGroup).length === 0 ? (
          <p className="text-sm text-ink-400">No data yet for this window.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(byGroup).map(([groupLabel, amount]) => (
              <div
                key={groupLabel}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-800/50 px-3 py-2"
              >
                <span className="text-ink-200">{groupLabel}</span>
                <span className="text-sm font-semibold text-white">
                  {amount.toLocaleString(undefined, { minimumFractionDigits: 0 })} {mainCurrency}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsSummary;
