import { apiClient } from "./client";
import type { Service } from "../entities/service/model";
import { ROUTES } from "../shared/config/routes";
import type { PaginationMeta } from "../shared/types/api/pagination";

interface Services {
  data: Service[];
  meta: PaginationMeta;
}

export type CreateServiceData = Omit<Service, "id">;

class ServiceService {
  async getServices(params: string = ""): Promise<Services> {
    const url = `${ROUTES.SERVICES.INDEX}${params}`;
    const response = await apiClient.get<Services>(url, true);
    return response;
  }

  async createService(serviceData: CreateServiceData): Promise<Service> {
    const response = await apiClient.post<{ service: Service }>(
      `${ROUTES.SERVICES.INDEX}`,
      { service: serviceData },
      true
    );
    return response.service;
  }

  async updateService(id: number, serviceData: CreateServiceData): Promise<Service> {
    const response = await apiClient.put<{ service: Service }>(
      `${ROUTES.SERVICES.INDEX}/${id}`,
      { service: serviceData },
      true
    );
    return response.service;
  }

  async deleteService(id: number): Promise<void> {
    await apiClient.delete(`${ROUTES.SERVICES.INDEX}/${id}`, true);
  }
}

export const serviceService = new ServiceService();
