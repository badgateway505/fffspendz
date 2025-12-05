import { create } from 'zustand';
import { useEffect } from 'react';
import type { Expense, NewExpenseInput, Currency } from '../domain/expense.types';
import { loadItem, saveItem } from '../services/storage/localStore';
import { useSettingsStore } from './settings.store';

// SECTION: state
interface ExpensesState {
  expenses: Expense[];
  addExpense: (input: NewExpenseInput) => Promise<Expense>;
  getAllExpenses: () => Expense[];
  getExpensesByDateRange: (startDate: Date, endDate: Date) => Expense[];
  initialize: () => Promise<void>;
}

// SECTION: helpers
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createExpense(input: NewExpenseInput): Expense {
  const now = new Date().toISOString();
  const settings = useSettingsStore.getState().settings;
  
  // Apply defaults
  const currency: Currency = input.currency || settings.mainCurrency || 'THB';
  const occurredAt = input.occurredAt || now;
  
  return {
    id: generateId(),
    amount: input.amount,
    currency,
    merchant: input.merchant,
    note: input.note,
    categoryId: input.categoryId,
    occurredAt,
    createdAt: now,
  };
}

// SECTION: actions
export const useExpensesStore = create<ExpensesState>((set, get) => ({
  expenses: [],

  addExpense: async (input: NewExpenseInput) => {
    const expense = createExpense(input);
    const newExpenses = [expense, ...get().expenses];
    set({ expenses: newExpenses });
    await saveItem('expenses', newExpenses);
    return expense;
  },

  getAllExpenses: () => {
    return get().expenses;
  },

  getExpensesByDateRange: (startDate: Date, endDate: Date) => {
    return get().expenses.filter((expense) => {
      const expenseDate = new Date(expense.occurredAt);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  },

  initialize: async () => {
    const loaded = await loadItem<Expense[]>('expenses', []);
    // Sort by occurredAt descending (newest first)
    const sorted = loaded.sort((a, b) => 
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
    set({ expenses: sorted });
  },
}));

// Hook to initialize expenses on mount
export function useExpenses() {
  const initialize = useExpensesStore((state) => state.initialize);
  const expenses = useExpensesStore((state) => state.expenses);
  const addExpense = useExpensesStore((state) => state.addExpense);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { expenses, addExpense };
}

