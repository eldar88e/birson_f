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

  async createMessage(conversationId: number, messageData: Message): Promise<void> {
    const url = `${ROUTES.CONVERSATIONS.INDEX}/${conversationId}${ROUTES.MESSAGES.INDEX}`;

    // Если есть файл — отправляем через FormData
    if (messageData.uploadfile) {
      const formData = new FormData();
      formData.append("message[uploadfile]", messageData.uploadfile);
      if (messageData.text) {
        formData.append("message[text]", messageData.text);
      }

      await apiClient.postFormData<void>(url, formData, true);
      return;
    }

    // Обычное текстовое сообщение
    await apiClient.post<void>(url, { message: messageData }, true);
  }
}

export const messageService = new MessageService();
