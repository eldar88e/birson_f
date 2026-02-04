export interface Car {
  id: number;
  owner_id: number;
  brand: string;
  model: string;
  license_plate: string;
  vin: string;
  year: number | null;
  // color: string;
  comment: string;
}
