import { create } from 'zustand';
import { useEffect } from 'react';
import type { Settings } from '../domain/expense.types';
import { loadItem, saveItem } from '../services/storage/localStore';
import { useCategoriesStore } from './categories.store';

// SECTION: state
interface SettingsState {
  settings: Settings;
  setMainCurrency: (currency: Settings['mainCurrency']) => Promise<void>;
  initialize: () => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  mainCurrency: 'THB',
  categories: [],
};

// SECTION: actions
export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  setMainCurrency: async (currency: Settings['mainCurrency']) => {
    const newSettings = { ...get().settings, mainCurrency: currency };
    set({ settings: newSettings });
    await saveItem('settings', newSettings);
  },

  initialize: async () => {
    const loaded = await loadItem<Settings>('settings', DEFAULT_SETTINGS);
    // Ensure categories are populated from categories store
    const categories = useCategoriesStore.getState().categories;
    set({
      settings: {
        ...loaded,
        categories: categories.length > 0 ? categories : loaded.categories,
      },
    });
  },
}));

// Hook to initialize settings on mount
export function useSettings() {
  const initialize = useSettingsStore((state) => state.initialize);
  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return settings;
}

