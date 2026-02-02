export interface Message {
  id?: number;
  conversation_id: number;
  text: string;
  direction?: "incoming" | "outgoing";
  created_at?: string;
  photo_url?: string;
  published_at?: string;
  msg_type?: "text" | "image";
  data?: {
    image_url?: string;
  };
  uploadfile?: File;
}
