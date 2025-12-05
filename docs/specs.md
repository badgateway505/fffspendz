# SmartSpends Web MVP v0.1 Specification  
**Storage: JSON-like storage (localForage) + Zustand global state**  
**Frontend: React + TS + Vite**

Goal: Build a stable, simple expense-tracking pipeline—voice/text → parse → preview → save → persistent history.

---

# 1. Core User Story

As a user, I want to:

- Speak or type a phrase like `"500 baht mcdonalds"`
- Get a parsed **draft**
- Edit fields
- Save
- See it instantly in my **persistent** expense history
- Edit expenses later

---

# 2. Non-Goals (Not in MVP)

- Authentication
- Cloud sync
- Real AI/NLP
- Analytics/charts
- Fancy UI
- Multi-user support
- Performance optimizations (later)

---

# 3. Tech Stack (MVP)

**Frontend:**

- React + TypeScript  
- Vite  
- Zustand (global state)
- Basic CSS or minimal Tailwind

**Voice:**

- Web Speech API (if available)

**Storage:**

### Use localForage as a tiny JSON-based persistence layer
It behaves like 3 JSON files:

```

expenses.json
categories.json
settings.json

````

But stored safely in IndexedDB and loaded via async API.

**Why not localStorage?**

- Too fragile  
- Too easily corrupted  
- Limited space  
- Slow  
- Bad on iOS  

**Why Zustand?**

- Simple global app state  
- No boilerplate  
- No re-render storms  
- Perfect for expense tracker flow  
- Compatible with async storage sync

---

# 4. Data Model

```ts
export type Currency = 'THB' | 'EUR';

export interface Category {
  id: string;
  name: string;
  colorHex: string;
  emoji: string;
  isDefault: boolean;
}

export interface Expense {
  id: string;
  createdAt: string;
  amount: number;
  currency: Currency;
  merchant: string;
  categoryId: string;
  comment?: string;
}

export interface Settings {
  primaryCurrencyMode: 'THB' | 'EUR' | 'BOTH';
}

export interface ExpenseDraft {
  rawText: string;
  amount?: number;
  currency?: Currency;
  merchant?: string;
  categoryId?: string;
}
````

---

# 5. Storage Layer (JSON-based)

### Backend: **localForage**

Works like:

* read “JSON file”
* write “JSON file”
* survives reloads
* async
* safe on all devices

### Storage API (simple)

```ts
import localforage from 'localforage';

export async function loadExpenses() {
  return (await localforage.getItem<Expense[]>('expenses.json')) ?? [];
}

export async function saveExpenses(expenses: Expense[]) {
  await localforage.setItem('expenses.json', expenses);
}
```

* If key is missing → return empty list
* If corrupted → fallback to empty list
* Always write the full list (atomic)

---

# 6. Global State Layer (Zustand)

### Why Zustand?

It gives:

* a central place for app logic
* predictable updates
* clean async storage integration
* no prop drilling
* no context re-render issues

### Zustand store shape

```ts
import { create } from 'zustand';
import { loadExpenses, saveExpenses } from '../storage/expenses';

export const useExpensesStore = create((set, get) => ({
  expenses: [],
  
  async init() {
    const data = await loadExpenses();
    set({ expenses: data });
  },
  
  async addExpense(expense) {
    const updated = [expense, ...get().expenses];
    set({ expenses: updated });
    await saveExpenses(updated);
  },
  
  async updateExpense(updatedExpense) {
    const updated = get().expenses.map(e =>
      e.id === updatedExpense.id ? updatedExpense : e
    );
    set({ expenses: updated });
    await saveExpenses(updated);
  }
}));
```

### App initialization

In `App.tsx`:

```ts
const init = useExpensesStore(s => s.init);

useEffect(() => {
  init();
}, [init]);
```

---

# 7. Screens & UI (Minimal)

### Main Screen

* Text input
* Mic button
* “Parse” button
* Draft preview
* Save button
* History list (bound to Zustand)
* Edit mode (modal or inline)

### Voice Input

* Web Speech API
* If unsupported: hide or disable mic

---

# 8. NLP Parsing (Local Only)

```ts
export function parseExpenseText(input: string, settings: Settings): ExpenseDraft {
  // extract amount
  // detect currency
  // remainder = merchant
  // no ML
  return draft;
}
```

Rules:

* First number → `amount`
* “баht / ฿ / baht” → THB
* “€ / eur / евро” → EUR
* else → fallback to settings.primaryCurrencyMode
* Everything else → merchant

---

# 9. App Flows

### 9.1 Text flow

1. User enters text
2. Clicks “Parse”
3. Draft appears
4. User edits
5. Save → Zustand → localForage
6. History updates instantly

### 9.2 Voice flow

Same as text, but input comes from Speech API.

### 9.3 Editing flow

* Click history item
* Open editor
* Save → overwrite in JSON (via Zustand)

---

# 10. Error Handling

* Storage failures → show toast, don’t wipe data
* Parsing failures → safe partial draft
* Voice failures → fallback to text
* No crashes allowed

---

# 11. Performance

* localForage + Zustand is extremely fast
* All operations are a few KB
* App responsive even with thousands of expenses

---

# 12. Success Criteria

* Expenses persist across reloads
* Voice input works in at least one modern browser
* No crashes or data loss
* Editing works
* UI is simple but usable
