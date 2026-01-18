import type { PaginationMeta } from "../../shared/types/api/pagination";

export interface ExpenseCategory {
    id?: number;
    title: string;
    description?: string;
    created_at?: string;
    active: boolean;
}

export interface ExpenseCategoryListResponse {
    data: ExpenseCategory[];
    meta: PaginationMeta;
}

export interface CreateExpenseCategoryData {
    title: string;
    description?: string;
    active: boolean;
}
