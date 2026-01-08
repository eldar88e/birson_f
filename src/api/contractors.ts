import { apiClient } from "./client";
import type { Contractor } from "../entities/contractor/model";

interface ContractorsResponse {
  data: Contractor[];
}

export type CreateContractorData = Omit<Contractor, "id">;

class ContractorService {
  async getContractors(): Promise<Contractor[]> {
    const response = await apiClient.get<ContractorsResponse>("/contractors", true);
    return response.data;
  }

  async searchContractors(query: string): Promise<Contractor[]> {
    const response = await apiClient.get<ContractorsResponse>(
      `/contractors?q%5Bname_or_phone_cont_any%5D=${encodeURIComponent(query)}`,
      true
    );
    return response.data;
  }

  async createContractor(contractorData: CreateContractorData): Promise<Contractor> {
    const response = await apiClient.post<{ contractor: Contractor }>(
      "/contractors",
      { contractor: contractorData },
      true
    );
    return response.contractor;
  }
}

export const contractorService = new ContractorService();

