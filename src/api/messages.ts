import { apiClient } from "./client";
import type { PaginationMeta } from "../shared/types/api/pagination";
import { ROUTES } from "../shared/config/routes";
import type { Message } from "../entities/message/model";

interface Messages {
  data: Message[];
  meta: PaginationMeta;
}

class MessageService {
  async getMessages(conversationId: number, params: string = ""): Promise<Messages> {
    const url = `${ROUTES.CONVERSATIONS.INDEX}/${conversationId}${ROUTES.MESSAGES.INDEX}${params}`;
    const response = await apiClient.get<Messages>(url, true);
    return response;
  }

  async createMessage(conversationId: number, messageData: Message): Promise<Message> {
    const response = await apiClient.post<{ message: Message }>(
      `${ROUTES.CONVERSATIONS.INDEX}/${conversationId}/${ROUTES.MESSAGES.INDEX}`,
      { message: messageData },
      true
    );
    return response.message;
  }
}

export const messageService = new MessageService();
