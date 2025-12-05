import localforage from 'localforage';

export type StorageKey = 'expenses' | 'categories' | 'settings';

const STORAGE_KEYS: Record<StorageKey, string> = {
  expenses: 'expenses',
  categories: 'categories',
  settings: 'settings',
};

const store = localforage.createInstance({
  name: 'smart-spends',
  storeName: 'app-data',
  description: 'Offline cache for Smart Spends',
});

// API:
export async function saveItem<T>(key: StorageKey, value: T): Promise<void> {
  try {
    await store.setItem<T>(STORAGE_KEYS[key], value);
  } catch (error) {
    console.error(`Failed to save ${key} to storage`, error);
    throw error;
  }
}

export async function loadItem<T>(key: StorageKey, fallback: T): Promise<T> {
  try {
    const value = await store.getItem<T>(STORAGE_KEYS[key]);
    return value ?? fallback;
  } catch (error) {
    console.error(`Failed to load ${key} from storage`, error);
    return fallback;
  }
}

export async function removeItem(key: StorageKey): Promise<void> {
  try {
    await store.removeItem(STORAGE_KEYS[key]);
  } catch (error) {
    console.error(`Failed to remove ${key} from storage`, error);
  }
}

export async function clearAll(): Promise<void> {
  try {
    await store.clear();
  } catch (error) {
    console.error('Failed to clear storage', error);
  }
}
