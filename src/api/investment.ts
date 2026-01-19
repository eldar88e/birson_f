import { apiClient } from "./client";
import type { Investment } from "../entities/investment/model";
import { ROUTES } from "../shared/config/routes";
import type { PaginationMeta } from "../shared/types/api/pagination";

interface Investments {
  data: Investment[];
  meta: PaginationMeta;
}

export type CreateInvestmentData = Omit<Investment, "id" | "created_at" | "user">;

class InvestmentService {
  async getInvestments(params: string = ""): Promise<Investments> {
    const url = `${ROUTES.INVESTMENTS.INDEX}${params}`;
    const response = await apiClient.get<Investments>(url, true);
    return response;
  }

  async createInvestment(investmentData: CreateInvestmentData): Promise<Investment> {
    const response = await apiClient.post<{ investment: Investment }>(
      `${ROUTES.INVESTMENTS.INDEX}`,
      { investment: investmentData },
      true
    );
    return response.investment;
  }

  async updateInvestment(id: number, investmentData: CreateInvestmentData): Promise<Investment> {
    const response = await apiClient.put<{ investment: Investment }>(
      `${ROUTES.INVESTMENTS.INDEX}/${id}`,
      { investment: investmentData },
      true
    );
    return response.investment;
  }

  async deleteInvestment(id: number): Promise<void> {
    await apiClient.delete(`${ROUTES.INVESTMENTS.INDEX}/${id}`, true);
  }
}

export const investmentService = new InvestmentService();
