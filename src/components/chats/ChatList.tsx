import { useState, useEffect, useRef } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { conversationService } from "../../api/conversation";
import { Conversation } from "../../entities/conversation/model";
import Loader from "../../shared/ui/Loader";
import { useNavigate, useSearchParams } from "react-router";

interface ChatListProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatList({ isOpen, onToggle }: ChatListProps) {
  const [isOpenTwo, setIsOpenTwo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentConversationId = searchParams.get("conversationId");
  const hasSetDefaultRef = useRef(false);

  useEffect(() => {
    setIsLoading(true);
    conversationService.getConversations().then((response) => {
      setIsLoading(false);
      setConversations(response.data);
      
      // Если нет выбранного conversation и есть список, выбираем первый (только один раз)
      const currentId = searchParams.get("conversationId");
      if (!hasSetDefaultRef.current && !currentId && response.data.length > 0) {
        hasSetDefaultRef.current = true;
        const firstConversationId = response.data[0].id;
        navigate(`?conversationId=${firstConversationId}`, { replace: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleDropdownTwo() {
    setIsOpenTwo(!isOpenTwo);
  }

  function closeDropdownTwo() {
    setIsOpenTwo(false);
  }

  function minutesAgo(dateString: string) {
    if (!dateString) return "";

    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / 1000 / 60);

    if (minutes === 0) return "только что";
    if (minutes > 60) return `${Math.floor(minutes / 60)} часов назад`;
  
    return `${minutes} мин назад`;
  }

  return (
    <div
      className={`flex-col overflow-auto no-scrollbar transition-all duration-300 ${
        isOpen
          ? "fixed top-0 left-0 z-999999 h-screen bg-white dark:bg-gray-900"
          : "hidden xl:flex"
      }`}
    >
      <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 xl:hidden">
        <div>
          <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Chat
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative inline-block">
            <button onClick={toggleDropdownTwo}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
              isOpen={isOpenTwo}
              onClose={closeDropdownTwo}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeDropdownTwo}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                onItemClick={closeDropdownTwo}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-10 h-10 text-gray-700 transition border border-gray-300 rounded-full dark:border-gray-700 dark:text-gray-400 dark:hover:text-white/90"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col max-h-full px-4 overflow-auto sm:px-5">
        <div className="max-h-full space-y-1 overflow-auto custom-scrollbar">
          {isLoading ? (
              <Loader text="Загрузка чатов..." />
            ) : (
              conversations.map((conversation) => {
                const isActive = currentConversationId === String(conversation.id);
                return (
                <div 
                  key={conversation.id} 
                  onClick={() => {
                    navigate(`?conversationId=${conversation.id}`);
                    // Закрываем sidebar только если он открыт (на мобильных устройствах)
                    if (isOpen) {
                      onToggle();
                    }
                  }}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-white/[0.03] ${
                    isActive ? "bg-brand-50 dark:bg-brand-900/20" : ""
                  }`}
                >
                  <div className="relative h-12 w-full max-w-[48px] rounded-full">
                    <img
                      src="./images/user/user-18.jpg"
                      alt="profile"
                      className="object-cover object-center w-full h-full overflow-hidden rounded-full"
                    />
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
                  </div>
                  <div className="w-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {conversation.user}
                        </h5>
                        <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
                          {conversation.source}
                        </p>
                      </div>
                      <span className="text-gray-400 text-theme-xs">
                        {minutesAgo(conversation.last_message_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }))
          }
        </div>
      </div>
    </div>
  );
}
