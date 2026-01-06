import { apiClient } from "./client";
import type { Contactor } from "../entities/contactor/model";

interface ContactorsResponse {
  data: Contactor[];
}

export type CreateContactorData = Omit<Contactor, "id">;

class ContactorService {
  async getContactors(): Promise<Contactor[]> {
    const response = await apiClient.get<ContactorsResponse>("/contactors", true);
    return response.data;
  }

  async searchContactors(query: string): Promise<Contactor[]> {
    const response = await apiClient.get<ContactorsResponse>(
      `/contactors?q%5Bname_cont_any%5D=${encodeURIComponent(query)}`,
      true
    );
    return response.data;
  }

  async createContactor(contactorData: CreateContactorData): Promise<Contactor> {
    const response = await apiClient.post<{ contactor: Contactor }>(
      "/contactors",
      { contactor: contactorData },
      true
    );
    return response.contactor;
  }
}

export const contactorService = new ContactorService();

