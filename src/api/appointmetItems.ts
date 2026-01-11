import { apiClient } from "./client";

export interface AppointmentItemPerformer {
  id?: number;
  performer_id: number;
  performer_type: "User" | "Contractor";
  performer_fee: number;
  performer_name?: string;
  _destroy?: boolean;
}

export interface AppointmentItem {
  id?: number;
  order_id: number;
  service_id: number;
  car_id?: number;
  state: "initial" | "diagnostic" | "agreement" | "processing" | "control" | "completed" | "cancelled";
  materials_price: number;
  materials_comment: string;
  delivery_price: number;
  delivery_comment: string;
  price: number;
  paid: boolean;
  comment: string;
  order_item_performers?: AppointmentItemPerformer[];
  service?: string;
  order_item_performers_attributes?: AppointmentItemPerformerAttribute[];
}

export interface AppointmentItemPerformerAttribute {
  id?: number;
  performer_id: number;
  performer_type: "User" | "Contractor";
  performer_fee: number;
  _destroy?: boolean;
}

export type CreateAppointmentItemData = Omit<AppointmentItem, "id" | "performers"> & {
  order_item_performers_attributes?: AppointmentItemPerformerAttribute[];
};

class AppointmentItemService {
  async createAppointmentItem(appointmentId: number, itemData: CreateAppointmentItemData): Promise<AppointmentItem> {
    const { order_item_performers_attributes, ...appointmentItemData } = itemData;
    
    const payload: any = {
      order_item: {
        ...appointmentItemData,
        order_item_performers_attributes: order_item_performers_attributes || [],
      },
    };

    const response = await apiClient.post<{ order_item: AppointmentItem }>(
      `/orders/${appointmentId}/order_items`,
      payload,
      true
    );

    return (response as any).order_item || (response as any).order?.order_items?.[0] || (response as any);
  }

  async getAppointmentItems(appointmentId: number): Promise<AppointmentItem[]> {
    const response = await apiClient.get<{ data: AppointmentItem[] }>(
      `/orders/${appointmentId}/order_items`,
      true
    );
    return response.data;
  }

  async updateAppointmentItem(appointmentId: number, itemId: number, itemData: CreateAppointmentItemData): Promise<AppointmentItem> {
    const { order_item_performers_attributes, ...appointmentItemsData } = itemData;
    
    const payload: any = {
      order_item: {
        ...appointmentItemsData,
        order_item_performers_attributes: order_item_performers_attributes || [],
      },
    };

    const response = await apiClient.put<{ order_item: AppointmentItem }>(
      `/orders/${appointmentId}/order_items/${itemId}`,
      payload,
      true
    );

    return (response as any).order_item || (response as any);
  }

  async delete(appointmentId: number, itemId: number): Promise<void> {
    await apiClient.delete(`/orders/${appointmentId}/order_items/${itemId}`, true);
  }
}

export const appointmentItemService = new AppointmentItemService();
