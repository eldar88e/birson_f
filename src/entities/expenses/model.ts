export interface Expense {
  id: number;
  category: string;
  amount: number;
  description?: string;
  spent_at: string;
  created_at: string;
}
