export const EXPENSE_CATEGORIES = [
  "other", "equipment", "service", "materials", "marketing", "software", "site"
] as const;

export interface Expense {
  id: number;
  category: (typeof EXPENSE_CATEGORIES)[number];
  amount: number;
  description?: string;
  spent_at: string;
  created_at: string;
}
