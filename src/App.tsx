import { useEffect, useState } from 'react';
import { QuickAddCard } from './features/quick-add/QuickAddCard';
import { useSettings } from './state/settings.store';
import { useExpensesStore } from './state/expenses.store';
import { LastSpendsList } from './features/overview/LastSpendsList';
import { AnalyticsSummary } from './features/analytics/AnalyticsSummary';
import { HistoryPage } from './features/history/HistoryPage';

function App() {
  // Initialize stores
  useSettings(); // Initializes settings
  const initializeExpenses = useExpensesStore((state) => state.initialize);
  const [view, setView] = useState<'home' | 'history'>('home');

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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView('home')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              view === 'home'
                ? 'bg-mint text-ink-900 shadow-lg shadow-mint/30'
                : 'bg-ink-700 text-ink-200 hover:bg-ink-600'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setView('history')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              view === 'history'
                ? 'bg-coral text-ink-900 shadow-lg shadow-coral/30'
                : 'bg-ink-700 text-ink-200 hover:bg-ink-600'
            }`}
          >
            History
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 pb-12">
        {view === 'home' ? (
          <>
            <QuickAddCard />

            <section className="rounded-2xl border border-white/10 bg-ink-700/70 p-5 shadow-lg shadow-ink-900/40">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-mint">Recent</p>
                  <h3 className="font-display text-xl font-semibold text-white">Last 5 spends</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setView('history')}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-ink-200 transition hover:border-white/30 hover:bg-ink-900/40"
                >
                  View all
                </button>
              </div>
              <LastSpendsList limit={5} />
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-ink-700/80 p-5 shadow-lg shadow-ink-900/40">
                <h3 className="font-display text-xl text-white">History</h3>
                <p className="text-ink-200/80">All spends, newest first. Edit/delete planned for beta.</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-ink-700/80 p-5 shadow-lg shadow-ink-900/40">
                <AnalyticsSummary />
              </div>
            </section>

            <section className="rounded-2xl border border-white/5 bg-ink-700/80 p-5 shadow-lg shadow-ink-900/40">
              <h3 className="font-display text-xl text-white">Settings</h3>
              <p className="text-ink-200/80">
                Set main currency (THB default) and preset groups (food / fun / bills). Expand later with RU speech,
                EUR support, and more.
              </p>
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-white/10 bg-ink-700/70 p-6 shadow-lg shadow-ink-900/40">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-mint">History</p>
                <h3 className="font-display text-2xl font-semibold text-white">All spends</h3>
              </div>
              <button
                type="button"
                onClick={() => setView('home')}
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-ink-200 transition hover:border-white/30 hover:bg-ink-900/40"
              >
                Back to main
              </button>
            </div>
            <HistoryPage />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
