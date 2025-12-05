import { loadItem, saveItem } from '../storage/localStore';

// TYPES:
export interface DebugEntry {
  timestamp: string;
  userPrompt: string;
  recognizedPhrase: string;
  parsedAmount?: number;
  parsedCurrency?: string;
  parsedMerchant?: string;
  parsedNote?: string;
  parsedCategory?: string;
  confidence?: number;
}

// API:
/**
 * Saves a debug entry to IndexedDB and triggers download of updated debug.json file.
 */
export async function saveDebugEntry(entry: DebugEntry): Promise<void> {
  const entries = await loadItem<DebugEntry[]>('debug', []);
  entries.push(entry);
  await saveItem('debug', entries);
  
  // Also trigger download of updated debug.json file
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'debug.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Gets all debug entries from IndexedDB.
 */
export async function getDebugEntries(): Promise<DebugEntry[]> {
  return loadItem<DebugEntry[]>('debug', []);
}

/**
 * Exports all debug entries as a JSON file download.
 */
export async function exportDebugEntries(): Promise<void> {
  const entries = await getDebugEntries();
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'debug.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Clears all debug entries.
 */
export async function clearDebugEntries(): Promise<void> {
  await saveItem('debug', []);
}

