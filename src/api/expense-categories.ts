import { apiClient } from "./client";
import type { ExpenseCategory, ExpenseCategoryListResponse } from "../entities/expense-category/model";
import { ROUTES } from "../shared/config/routes";

export const expenseCategoryService = {
    async getList(params: string = "") {
        const response = await apiClient.get<ExpenseCategoryListResponse>(`${ROUTES.EXPENSE_CATEGORIES.INDEX}${params}`, true);
        return response;
    },
    async getById(id: number) {
        const response = await apiClient.get<{ expense_category: ExpenseCategory }>(`${ROUTES.EXPENSE_CATEGORIES.INDEX}/${id}`, true);
        return response.expense_category;
    },
    async create(data: Omit<ExpenseCategory, 'id'>) {
        const response = await apiClient.post<{ expense_category: ExpenseCategory }>(ROUTES.EXPENSE_CATEGORIES.INDEX, data, true);
        return response.expense_category;
    },
    async update(id: number, data: Partial<ExpenseCategory>) {
        const response = await apiClient.put<{ expense_category: ExpenseCategory }>(`${ROUTES.EXPENSE_CATEGORIES.INDEX}/${id}`, data, true);
        return response.expense_category;
    },
    async delete(id: number) {
        const response = await apiClient.delete<{ expense_category: ExpenseCategory }>(`${ROUTES.EXPENSE_CATEGORIES.INDEX}/${id}`, true);
        return response.expense_category;
    }
}
