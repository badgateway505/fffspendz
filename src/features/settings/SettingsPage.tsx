import { useMemo } from 'react';
import { useSettingsStore } from '../../state/settings.store';
import { useCategoriesStore } from '../../state/categories.store';

const currencies = ['THB', 'EUR'] as const;

export function SettingsPage() {
  const settings = useSettingsStore((state) => state.settings);
  const setMainCurrency = useSettingsStore((state) => state.setMainCurrency);
  const categories = useCategoriesStore((state) => state.categories);

  const presetCategories = useMemo(() => categories, [categories]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-6 shadow-lg shadow-ink-900/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-mint">Settings</p>
            <h3 className="font-display text-xl font-semibold text-white">Main currency</h3>
          </div>
        </div>
        <p className="mt-2 text-sm text-ink-300">Default currency used for analytics and new expenses.</p>
        <div className="mt-4 flex gap-3">
          {currencies.map((currency) => (
            <button
              key={currency}
              type="button"
              onClick={() => setMainCurrency(currency)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                settings.mainCurrency === currency
                  ? 'bg-mint text-ink-900 shadow-lg shadow-mint/30'
                  : 'bg-ink-800 text-ink-200 hover:bg-ink-700'
              }`}
            >
              {currency}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-6 shadow-lg shadow-ink-900/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-mint">Groups</p>
            <h3 className="font-display text-xl font-semibold text-white">Preset categories</h3>
          </div>
        </div>
        <p className="mt-2 text-sm text-ink-300">Used for parsing guesses and analytics grouping.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {presetCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-800/60 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white">{category.label}</p>
                <p className="text-xs text-ink-400">Key: {category.key}</p>
              </div>
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: category.color || '#fff' }}
              />
            </div>
          ))}
          {presetCategories.length === 0 && (
            <p className="text-sm text-ink-400">No categories configured.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
