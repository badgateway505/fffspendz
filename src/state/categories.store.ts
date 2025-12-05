import { create } from 'zustand';
import type { Category, CategoryKey } from '../domain/expense.types';

// SECTION: state
interface CategoriesState {
  categories: Category[];
  getCategoryById: (id: string) => Category | undefined;
  getCategoryByKey: (key: CategoryKey | string) => Category | undefined;
}

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-food', key: 'food', label: 'Food', color: '#ff6f61' },
  { id: 'cat-fun', key: 'fun', label: 'Fun', color: '#50e3c2' },
  { id: 'cat-bills', key: 'bills', label: 'Bills', color: '#ffd166' },
];

// SECTION: actions
export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: DEFAULT_CATEGORIES,

  getCategoryById: (id: string) => {
    return get().categories.find((cat) => cat.id === id);
  },

  getCategoryByKey: (key: CategoryKey | string) => {
    return get().categories.find((cat) => cat.key === key);
  },
}));

