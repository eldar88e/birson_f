import type { User } from "../user/model";
import type { Contractor } from "../contractor/model";

export type AppointmentItemState = "initial" | "diagnostic" | "agreement" | "processing" | "control" | "completed" | "cancelled";

export const APPOINTMENT_ITEM_STATES = [
  { value: "initial", label: "В ожидании" },
  { value: "diagnostic", label: "Диагностика" },
  { value: "agreement", label: "Согласование" },
  { value: "processing", label: "В процессе" },
  { value: "control", label: "Контроль" },
  { value: "completed", label: "Завершен" },
  { value: "cancelled", label: "Отменен" },
]

export interface AppointmentItem {
  id: number;
  order_id: number;
  service_id: number;
  service: string;
  performer: User | Contractor;
  price: number;
  paid: boolean;
  state: AppointmentItemState
  materials_price: number;
  materials_comment: string;
  delivery_price: number;
  delivery_comment: string;
  performer_fee: number;
  comment: string;
}
