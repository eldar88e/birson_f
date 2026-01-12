import { apiClient } from "./client";
import type { Expense } from "../entities/expenses/model";
import { ROUTES } from "../shared/config/routes";
import type { PaginationMeta } from "../shared/types/api/pagination";

interface Expenses {
  data: Expense[];
  meta: PaginationMeta;
}

export type CreateExpenseData = Omit<Expense, "id">;
// TODO: Add create expense data type

class ExpenseService {
  async getExpenses(params: string = ""): Promise<Expenses> {
    const url = `${ROUTES.EXPENSES.INDEX}${params}`;
    const response = await apiClient.get<Expenses>(url, true);
    return response;
  }

  async createExpense(expenseData: CreateExpenseData): Promise<Expense> {
    const response = await apiClient.post<{ expense: Expense }>(
      `${ROUTES.SERVICES.INDEX}`,
      { expense: expenseData },
      true
    );
    return response.expense;
  }

  async deleteExpense(id: number): Promise<void> {
    await apiClient.delete(`${ROUTES.EXPENSES.INDEX}/${id}`, true);
  }
}

export const expenseService = new ExpenseService();
