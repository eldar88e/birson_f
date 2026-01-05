import type { User } from "../user/model";
import type { Car } from "../car/model";

export interface Appointment {
  id: number;
  client_id: number;
  client: string | User;
  car: string | Car;
  car_id: number;
  state: "initial" | "processing" | "completed" | "cancelled";
  price: number;
  expense: number;
  paid: boolean;
  comment: string;
  appointment_at: string;
  processing_at: string;
  completed_at: string;
  cancelled_at: string;
  created_at: string;
  updated_at: string;
}
