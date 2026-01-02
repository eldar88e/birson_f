export interface Appointment {
  id: number;
  user_id: number;
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
