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
    const url = `${ROUTES.CONVERSATIONS.INDEX}/${conversationId}${ROUTES.MESSAGES.INDEX}`;

    // Если есть файл — отправляем через FormData
    if (messageData.uploadfile) {
      const formData = new FormData();
      formData.append("message[uploadfile]", messageData.uploadfile);
      if (messageData.text) {
        formData.append("message[text]", messageData.text);
      }

      const response = await apiClient.postFormData<{ data: { message: Message } }>(
        url,
        formData,
        true
      );
      return response.data.message;
    }

    // Обычное текстовое сообщение
    const response = await apiClient.post<{ data: { message: Message } }>(
      url,
      { message: messageData },
      true
    );
    return response.data.message;
  }
}

export const messageService = new MessageService();
