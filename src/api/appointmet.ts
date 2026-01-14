import { apiClient } from "./client";
import type { Appointment } from "../entities/appointments/model";
import type { PaginationMeta } from "../shared/types/api/pagination";

export const API_APPOINTMENT_PATH = "/orders"

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
    const response = await apiClient.get<{ order: Appointment }>(url, true);
    return response.order;
  }

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    const url = `${API_APPOINTMENT_PATH}`;
    const response = await apiClient.post<{ order: Appointment }>(url, { order: appointmentData }, true);
    return response.order;
  }

  async updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment> {
    const url = `${API_APPOINTMENT_PATH}/${id}`;
    const response = await apiClient.put<{ order: Appointment }>(
      url,
      { order: appointmentData },
      true
    );
    return response.order;
  }

  async deleteAppointment(id: number): Promise<void> {
    const url = `${API_APPOINTMENT_PATH}/${id}`
    await apiClient.delete(url, true);
  }
}

export const appointmentService = new AppointmentService();
