import { apiClient } from "./client";
import type { Conversation } from "../entities/conversation/model";
import type { PaginationMeta } from "../shared/types/api/pagination";
import { ROUTES } from "../shared/config/routes";

interface Conversations {
  data: Conversation[];
  meta: PaginationMeta;
}

class ConversationService {
  async getConversations(params: string = ""): Promise<Conversations> {
    const url = `${ROUTES.CONVERSATIONS.INDEX}${params}`;
    const response = await apiClient.get<Conversations>(url, true);
    return response;
  }

  async getConversation(id: number): Promise<Conversation> {
    const response = await apiClient.get<{ conversation: Conversation }>(
      `${ROUTES.CONVERSATIONS.INDEX}/${id}`,
      true
    );
    return response.conversation;
  }

  async saveConversationUser(conversationId: number): Promise<void> {
    await apiClient.post<void>(
      `${ROUTES.CONVERSATIONS.INDEX}/${conversationId}/user`,
      {},
      true
    );
  }

  async deleteConversation(conversationId: number): Promise<void> {
    await apiClient.delete(
      `${ROUTES.CONVERSATIONS.INDEX}/${conversationId}`,
      true
    );
  }
}

export const conversationService = new ConversationService();
