import { useState, type FormEvent } from "react";
import { messageService } from "../../api/messages";
import type { Message } from "../../entities/message/model";
import SvgIcon from "../../shared/ui/SvgIcon";

interface ChatBoxSendFormProps {
  conversationId: number | null;
  onMessageSent?: (message: Message) => void;
}

export default function ChatBoxSendForm({ conversationId, onMessageSent }: ChatBoxSendFormProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !conversationId || isSending) return;

    setIsSending(true);
    try {
      const created = await messageService.createMessage(conversationId, {
        conversation_id: conversationId,
        text: trimmed,
      });
      setText("");
      onMessageSent?.(created);
    } catch {
      // TODO: показать ошибку пользователю
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="sticky bottom-0 p-3 border-t border-gray-200 dark:border-gray-800">
      <form className="flex items-center justify-between" onSubmit={handleSubmit}>
        <div className="relative w-full">
          <button type="button" className="absolute text-gray-500 -translate-y-1/2 left-1 top-1/2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 sm:left-3">
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12ZM10.0001 9.23256C10.0001 8.5422 9.44042 7.98256 8.75007 7.98256C8.05971 7.98256 7.50007 8.5422 7.50007 9.23256V9.23266C7.50007 9.92301 8.05971 10.4827 8.75007 10.4827C9.44042 10.4827 10.0001 9.92301 10.0001 9.23266V9.23256ZM15.2499 7.98256C15.9403 7.98256 16.4999 8.5422 16.4999 9.23256V9.23266C16.4999 9.92301 15.9403 10.4827 15.2499 10.4827C14.5596 10.4827 13.9999 9.92301 13.9999 9.23266V9.23256C13.9999 8.5422 14.5596 7.98256 15.2499 7.98256ZM9.23014 13.7116C8.97215 13.3876 8.5003 13.334 8.17625 13.592C7.8522 13.85 7.79865 14.3219 8.05665 14.6459C8.97846 15.8037 10.4026 16.5481 12 16.5481C13.5975 16.5481 15.0216 15.8037 15.9434 14.6459C16.2014 14.3219 16.1479 13.85 15.8238 13.592C15.4998 13.334 15.0279 13.3876 14.7699 13.7116C14.1205 14.5274 13.1213 15.0481 12 15.0481C10.8788 15.0481 9.87961 14.5274 9.23014 13.7116Z"
                fill=""
              />
            </svg>
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            disabled={!conversationId || isSending}
            className="w-full pl-12 pr-5 text-sm text-gray-800 bg-transparent border-none outline-hidden h-9 placeholder:text-gray-400 focus:border-0 focus:ring-0 dark:text-white/90 disabled:opacity-50"
          />
        </div>

        <div className="flex items-center">
          <button type="button" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
            <SvgIcon name="attach" width={24} />
          </button>
          <button
            type="submit"
            disabled={!conversationId || !text.trim() || isSending}
            className="flex items-center justify-center ml-3 text-white rounded-lg h-9 w-9 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed xl:ml-5"
          >
            <SvgIcon name="send" width={24} />
          </button>
        </div>
      </form>
    </div>
  );
}
