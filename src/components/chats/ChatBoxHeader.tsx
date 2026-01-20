import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useSearchParams } from "react-router";
import { conversationService } from "../../api/conversation";
import { Conversation } from "../../entities/conversation/model";
import Loader from "../../shared/ui/Loader";

export default function ChatBoxHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  useEffect(() => {
    if (!conversationId) {
      setCurrentConversation(null);
      return;
    }

    setIsLoading(true);
    conversationService.getConversation(Number(conversationId))
      .then((data) => {
        setCurrentConversation(data);
      })
      .catch((error) => {
        console.error("Failed to load conversation:", error);
        setCurrentConversation(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [conversationId]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="sticky flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 xl:px-6">
      <div className="flex items-center gap-3">
        {isLoading ? (
          <Loader text="..." height={20} />
        ) : (
          <>
            <div className="relative h-12 w-full max-w-[48px] rounded-full">
              <img
                src="./images/user/user-18.jpg"
                alt={currentConversation?.user || "profile"}
                className="object-cover object-center w-full h-full overflow-hidden rounded-full"
              />
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {currentConversation?.user || "Неизвестный пользователь"}
              </h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentConversation?.source || "Неизвестный источник"}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative -mb-1.5">
          <div className="relative inline-block">
            <button onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
