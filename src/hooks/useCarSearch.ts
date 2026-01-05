import { useState, useCallback } from "react";
import { carService } from "../api/cars";
import type { Car } from "../entities/car/model";

export function useCarSearch(ownerId?: number) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCars = useCallback(async () => {
    if (!ownerId) {
      setCars([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await carService.getCarsByOwner(ownerId);
      setCars(results);
    } catch {
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  return { cars, isLoading, loadCars };
}
