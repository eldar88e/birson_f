import { apiClient } from "./client";
import type { Service } from "../entities/service/model";

interface ServicesResponse {
  data: Service[];
}

export type CreateServiceData = Omit<Service, "id">;

class ServiceService {
  async getServices(): Promise<Service[]> {
    const response = await apiClient.get<ServicesResponse>("/services", true);
    return response.data;
  }

  async createService(serviceData: CreateServiceData): Promise<Service> {
    const response = await apiClient.post<{ service: Service }>(
      "/services",
      { service: serviceData },
      true
    );
    return response.service;
  }
}

export const serviceService = new ServiceService();
