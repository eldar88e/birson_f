export interface Conversation {
  id: number;
  source: string;
  user_id: number;
  user: string;
  last_message_at: string;
  photo_url?: string;
}
