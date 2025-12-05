import { useState } from 'react';

const demoTips = [
  'Tap the mic and say “bbq hogfather 1200 baht ribs with Dasha”.',
  'Use the text box if you prefer typing.',
  'Preview will auto-detect amount, currency, and group guess.',
];

function App() {
  const [tipIndex, setTipIndex] = useState(0);

  const handleNextTip = () => {
    setTipIndex((current) => (current + 1) % demoTips.length);
  };

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
        <section className="rounded-2xl bg-ink-700/80 p-6 shadow-xl shadow-ink-900/40 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">Quick add</h2>
              <p className="text-ink-200/80">
                Voice and text input with live parsing into amount, currency, merchant, and group.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNextTip}
              className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-ink-900 transition hover:-translate-y-0.5 hover:bg-coral/90"
            >
              Next tip
            </button>
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-ink-900/40 p-4">
            <p className="font-semibold text-sunshine">Tip</p>
            <p className="text-ink-200">{demoTips[tipIndex]}</p>
          </div>
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
