import { useEffect } from 'react';
import { QuickAddCard } from './features/quick-add/QuickAddCard';
import { useSettings } from './state/settings.store';
import { useExpensesStore } from './state/expenses.store';
import { LastSpendsList } from './features/overview/LastSpendsList';

function App() {
  // Initialize stores
  useSettings(); // Initializes settings
  const initializeExpenses = useExpensesStore((state) => state.initialize);

  useEffect(() => {
    initializeExpenses();
  }, [initializeExpenses]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-900 via-ink-700 to-ink-900 text-ink-200">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 py-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-mint">Smart Spends</p>
          <h1 className="font-display text-3xl font-bold text-white">Voice-first spend tracker</h1>
        </div>
        <div className="rounded-full bg-ink-700 px-4 py-2 text-sm text-ink-200 shadow-lg shadow-ink-900/50">
          MVP setup ready
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 pb-12">
        <QuickAddCard />

        <section className="rounded-2xl border border-white/10 bg-ink-700/70 p-5 shadow-lg shadow-ink-900/40">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-mint">Recent</p>
              <h3 className="font-display text-xl font-semibold text-white">Last 5 spends</h3>
            </div>
          </div>
          <LastSpendsList limit={5} />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-ink-700/80 p-5 shadow-lg shadow-ink-900/40">
            <h3 className="font-display text-xl text-white">History</h3>
            <p className="text-ink-200/80">All spends, newest first. Edit/delete planned for beta.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-ink-700/80 p-5 shadow-lg shadow-ink-900/40">
            <h3 className="font-display text-xl text-white">Analytics</h3>
            <p className="text-ink-200/80">Totals and by-group snapshots. Future charts and filters.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/5 bg-ink-700/80 p-5 shadow-lg shadow-ink-900/40">
          <h3 className="font-display text-xl text-white">Settings</h3>
          <p className="text-ink-200/80">
            Set main currency (THB default) and preset groups (food / fun / bills). Expand later with RU speech,
            EUR support, and more.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
