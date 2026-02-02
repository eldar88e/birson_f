import { useEffect, useRef, useCallback } from "react";
import { Subscription } from "@rails/actioncable";
import { subscribeToConversation } from "../api/cable";
import type { Message } from "../entities/message/model";

interface UseConversationChannelOptions {
  conversationId: number | null;
  onNewMessage?: (message: Message) => void;
  onMessageUpdated?: (message: Message) => void;
  onMessageDeleted?: (messageId: number) => void;
}

export function useConversationChannel({
  conversationId,
  onNewMessage,
  onMessageUpdated,
  onMessageDeleted,
}: UseConversationChannelOptions) {
  const subscriptionRef = useRef<Subscription | null>(null);

  const handleMessage = useCallback(
    (data: unknown) => {
      const payload = data as { message?: Message };
      if (payload.message) onNewMessage?.(payload.message);
    },
    [onNewMessage, onMessageUpdated, onMessageDeleted]
  );

  useEffect(() => {
    if (!conversationId) return;

    subscriptionRef.current = subscribeToConversation(conversationId, {
      onMessage: handleMessage,
      onConnected: () => {
        console.log(`Connected to conversation ${conversationId}`);
      },
      onDisconnected: () => {
        console.log(`Disconnected from conversation ${conversationId}`);
      },
    });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [conversationId, handleMessage]);
}
