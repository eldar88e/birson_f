import { apiClient } from "./client";

export interface OrderItemPerformer {
  id?: number;
  performer_id: number;
  performer_type: "User" | "Contractor";
  performer_fee: number;
  performer_name?: string;
  _destroy?: boolean;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  service_id: number;
  state: "initial" | "diagnostic" | "agreement" | "processing" | "control" | "completed" | "cancelled";
  materials_price: number;
  materials_comment: string;
  delivery_price: number;
  delivery_comment: string;
  price: number;
  paid: boolean;
  comment: string;
  order_item_performers?: OrderItemPerformer[];
  service?: string;
}

export interface OrderItemPerformerAttribute {
  id?: number;
  performer_id: number;
  performer_type: "User" | "Contractor";
  performer_fee: number;
  _destroy?: boolean;
}

export type CreateOrderItemData = Omit<OrderItem, "id" | "performers"> & {
  order_item_performers_attributes?: OrderItemPerformerAttribute[];
};

class OrderItemService {
  async createOrderItem(orderId: number, itemData: CreateOrderItemData): Promise<OrderItem> {
    // Prepare the data for API - extract performers and convert to order_item_performers_attributes
    const { order_item_performers_attributes, ...orderItemData } = itemData;
    
    const payload: any = {
      order_item: {
        ...orderItemData,
        order_item_performers_attributes: order_item_performers_attributes || [],
      },
    };

    const response = await apiClient.post<{ order_item: OrderItem }>(
      `/orders/${orderId}/order_items`,
      payload,
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
