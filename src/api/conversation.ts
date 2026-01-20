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
}

export const conversationService = new ConversationService();
