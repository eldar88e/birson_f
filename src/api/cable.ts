import { createConsumer, Consumer, Subscription } from "@rails/actioncable";
import { getStoredToken } from "../shared/lib/authStorage";

const WS_URL = "wss://birson.tgapp.online/cable";

let consumer: Consumer | null = null;

export function getCable(): Consumer | null {
  const token = getStoredToken();
  if (!token) return null;

  if (!consumer) {
    consumer = createConsumer(`${WS_URL}?token=${token}`);
  }

  return consumer;
}

export function disconnectCable(): void {
  if (consumer) {
    consumer.disconnect();
    consumer = null;
  }
}

export interface ConversationChannelCallbacks {
  onMessage: (message: unknown) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export function subscribeToConversation(
  conversationId: number,
  callbacks: ConversationChannelCallbacks
): Subscription | null {
  const cable = getCable();
  if (!cable) return null;

  return cable.subscriptions.create(
    {
      channel: "ConversationChannel",
      conversation_id: conversationId,
    },
    {
      received(data: unknown) {
        // console.log("[ActionCable] Raw message:", JSON.stringify(data, null, 2));
        callbacks.onMessage(data);
      },
      connected() {
        console.log("[ActionCable] Connected to conversation", conversationId);
        callbacks.onConnected?.();
      },
      disconnected() {
        console.log("[ActionCable] Disconnected");
        callbacks.onDisconnected?.();
      },
    }
  );
}
