import { apiClient } from "./client";
import { User } from "../entities/user/model";
import { Contactor } from "../entities/contactor/model";

export interface OrderItem {
  id?: number;
  order_id: number;
  service_id: number;
  performer_type: "User" | "Contactor";
  performer_id: number;
  state: "initial" | "diagnostic" | "agreement" | "processing" | "control" | "completed" | "cancelled";
  materials_price: number;
  materials_comment: string;
  delivery_price: number;
  delivery_comment: string;
  performer_fee: number,
  price: number;
  paid: boolean;
  comment: string;
  performer?: User | Contactor;
  service?: string;
}

export type CreateOrderItemData = Omit<OrderItem, "id">;

class OrderItemService {
  async createOrderItem(orderId: number, itemData: CreateOrderItemData): Promise<OrderItem> {
    const response = await apiClient.post<{ order_item: OrderItem }>(
      `/orders/${orderId}/order_items`,
      { order_item: itemData },
      true
    );

    return (response as any).order_item || (response as any).order?.order_items?.[0] || (response as any);
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const response = await apiClient.get<{ data: OrderItem[] }>(
      `/orders/${orderId}/order_items`,
      true
    );
    return response.data;
  }

  async deleteOrderItem(orderId: number, itemId: number): Promise<void> {
    await apiClient.delete(`/orders/${orderId}/order_items/${itemId}`, true);
  }
}

export const orderItemService = new OrderItemService();
