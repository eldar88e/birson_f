import { apiClient } from "./client";
import type { Contractor } from "../entities/contractor/model";
import type { PaginationMeta } from "../shared/types/api/pagination";
import { ROUTES } from "../shared/config/routes";

interface ContractorsResponse {
  data: Contractor[];
}

interface Contractors {
  data: Contractor[];
  meta: PaginationMeta;
}

export type CreateContractorData = Omit<Contractor, "id">;
export type UpdateContractorData = Partial<CreateContractorData>;

class ContractorService {
  async getContractors(params: string = ""): Promise<Contractors> {
    const url = `${ROUTES.CONTRACTORS.INDEX}${params}`;
    const response = await apiClient.get<Contractors>(url, true);
    return response;
  }

  async searchContractors(query: string): Promise<Contractor[]> {
    const response = await apiClient.get<ContractorsResponse>(
      `${ROUTES.CONTRACTORS.INDEX}?q%5Bname_or_phone_cont_any%5D=${encodeURIComponent(query)}`,
      true
    );
    return response.data;
  }

  async createContractor(contractorData: CreateContractorData): Promise<Contractor> {
    const response = await apiClient.post<{ contractor: Contractor }>(
      `${ROUTES.CONTRACTORS.INDEX}`,
      { contractor: contractorData },
      true
    );
    return response.contractor;
  }

  async updateContractor(id: number, contractorData: UpdateContractorData): Promise<Contractor> {
    const response = await apiClient.put<{ contractor: Contractor }>(
      `${ROUTES.CONTRACTORS.INDEX}/${id}`,
      { contractor: contractorData },
      true
    );
    return response.contractor;
  }

  async deleteContractor(id: number): Promise<void> {
    await apiClient.delete(`${ROUTES.CONTRACTORS.INDEX}/${id}`, true);
  }
}

export const contractorService = new ContractorService();

