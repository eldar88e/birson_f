import type { AppointmentItem } from "../../api/appointmetItems";

export interface Appointment {
  id: number;
  client_id: number;
  client_full_name: string;
  state: "initial" | "processing" | "completed" | "cancelled";
  price: number;
  expense: number;
  paid: boolean;
  paid_at: string;
  deposit: number;
  comment: string;
  appointment_at: string;
  processing_at: string;
  completed_at: string;
  cancelled_at: string;
  created_at: string;
  updated_at: string;
  order_items?: AppointmentItem[];
  order_items_attributes?: AppointmentItem[];
}
