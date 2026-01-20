export interface Message {
  id?: number;
  conversation_id: number;
  text: string;
  direction?: "incoming" | "outgoing";
  created_at?: string;
}
