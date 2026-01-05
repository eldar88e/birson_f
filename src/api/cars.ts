import { apiClient } from "./client";
import type { Car } from "../entities/car/model";
import { ROUTES } from "../shared/config/routes";

interface CarsResponse {
  data: Car[];
}

export type CreateCarData = Omit<Car, "id">;

class CarService {
  async getCars(): Promise<Car[]> {
    const response = await apiClient.get<CarsResponse>(ROUTES.CARS.INDEX, true);
    return response.data;
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
}

export const carService = new CarService();

