import { apiClient } from "./client";
import type { Car } from "../entities/car/model";
import { ROUTES } from "../shared/config/routes";
import type { PaginationMeta } from "../shared/types/api/pagination";

interface CarsResponse {
  data: Car[];
}

interface Cars {
  data: Car[];
  meta: PaginationMeta;
}

export type CreateCarData = Omit<Car, "id">;

class CarService {
  async getCars(params: string): Promise<Cars> {
    const url = `${ROUTES.CARS.INDEX}${params}`
    const response = await apiClient.get<Cars>(url, true);
    return response;
  }

  async searchCars(query: string): Promise<Car[]> {
    const response = await apiClient.get<CarsResponse>(
      `${ROUTES.CARS.INDEX}?q%5Bbrand_or_model_or_license_plate_cont_any%5D=${encodeURIComponent(query)}&button=`,
      true
    );
    return response.data;
  }

  async getCarsByOwner(ownerId: number): Promise<Car[]> {
    const response = await apiClient.get<CarsResponse>(
      `${ROUTES.CARS.INDEX}?q%5Bowner_id_eq%5D=${ownerId}`,
      true
    );
    return response.data;
  }

  async createCar(carData: CreateCarData): Promise<Car> {
    const response = await apiClient.post<{ car: Car }>(
      ROUTES.CARS.INDEX,
      { car: carData },
      true
    );
    return response.car;
  }

  async deleteCar(id: number): Promise<void> {
    await apiClient.delete(`${ROUTES.CARS.INDEX}/${id}`, true);
  }
}

export const carService = new CarService();

