import { useState, useEffect, useRef, useCallback } from "react";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxSendForm from "./ChatBoxSendForm";
import { messageService } from "../../api/messages";
import { Message } from "../../entities/message/model";
import { useSearchParams } from "react-router";
import Loader from "../../shared/ui/Loader";
import { timeAgo } from "../../shared/lib/formatDate";

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(() => {
    if (!conversationId) return;
    setIsLoading(true);
    setError("");
    messageService
      .getMessages(Number(conversationId))
      .then((response) => {
        setMessages(response.data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load messages");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setError("");
      return;
    }
    fetchMessages();
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, isLoading]);

  if (error) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-3/4">
        <div className="flex-1 max-h-full p-5 space-y-6 overflow-auto custom-scrollbar xl:space-y-8 xl:p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-3/4">
      {/* <!-- ====== Chat Box Start --> */}
      <ChatBoxHeader />
      <div 
        ref={messagesContainerRef}
        className="flex-1 max-h-full p-5 space-y-6 overflow-auto custom-scrollbar xl:space-y-8 xl:p-6"
      >
        {!conversationId ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Выберите conversation для просмотра сообщений</p>
          </div>
        ) : isLoading ? (
          <Loader text="Загрузка сообщений..." height={20} />
        ) : (
          <>
            {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.direction === "outgoing" ? "justify-end" : "items-start gap-4"
              }`}
            >
              {message.direction !== "outgoing" && (
                <div className="w-10 h-10 overflow-hidden rounded-full">
                  <img
                    src="./images/user/user-18.jpg"
                    alt="profile"
                    className="object-cover object-center w-full h-full"
                  />
                </div>
              )}
              <div className={`${message.direction === "outgoing" ? "text-right" : ""}`}>
                <div
                  className={`px-3 py-2 rounded-lg ${
                    message.direction === "outgoing"
                      ? "bg-brand-500 text-white dark:bg-brand-500"
                      : "bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white/90"
                  } ${message.direction === "outgoing" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                >
                  <p className="text-sm ">{message.text}</p>
                </div>
                <p className="mt-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  {timeAgo(message.created_at || "")}
                </p>
              </div>
            </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatBoxSendForm
        conversationId={conversationId ? Number(conversationId) : null}
        onMessageSent={(msg) => setMessages((prev) => [...prev, msg])}
      />
      {/* <!-- ====== Chat Box End --> */}
    </div>
  );
}
