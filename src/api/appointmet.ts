import { apiClient } from "./client";
import type { Appointment } from "../entities/appointments/model";
import type { PaginationMeta } from "../shared/types/api/pagination";

const API_APPOINTMENT_PATH = "/orders"

interface Appointments {
  data: Appointment[];
  meta: PaginationMeta;
}

class AppointmentService {
  async getAppointments(params: string): Promise<Appointments> {
    const url = `${API_APPOINTMENT_PATH}${params}`
    const response = await apiClient.get<Appointments>(url, true);
    return response;
  }

  async getAppointment(id: number): Promise<Appointment> {
    const url = `${API_APPOINTMENT_PATH}/${id}`
    const response = await apiClient.get<Appointment>(url, true);
    return response;
  }

  async deleteAppointment(id: number): Promise<void> {
    const url = `${API_APPOINTMENT_PATH}/${id}`
    await apiClient.delete(url, true);
  }
}

export const appointmentService = new AppointmentService();
