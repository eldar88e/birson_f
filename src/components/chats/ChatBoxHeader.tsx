import { useState, useEffect, useRef } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import SvgIcon from "../../shared/ui/SvgIcon";
import { isRecentlyActive } from "../../shared/lib/formatDate";
import { useNavigate, useSearchParams } from "react-router";
import { ROUTES } from "../../shared/config/routes";
import { conversationService } from "../../api/conversation";
import { Conversation } from "../../entities/conversation/model";
import { useNotification } from "../../context/NotificationContext";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";
import { ConfirmDeleteModal } from "../../shared/ui/ConfirmDeleteModal";
import Loader from "../../shared/ui/Loader";
import { useTranslation } from "react-i18next";

export default function ChatBoxHeader() {
  const { t } = useTranslation("chat");
  const [isOpen, setIsOpen] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const conversationId = searchParams.get("conversationId");
  const deleteTargetIdRef = useRef<number | null>(null);
  const { showNotification } = useNotification();

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

  const deleteModal = useConfirmDelete({
    onDelete: async () => {
      const id = deleteTargetIdRef.current;
      if (id == null) return;
      await conversationService.deleteConversation(id);
    },
    onSuccess: () => {
      navigate(ROUTES.CHATS.INDEX, { replace: true });
      window.dispatchEvent(new CustomEvent("chats:conversationDeleted"));
    },
    successMessage: "Диалог удалён",
    errorMessage: "Не удалось удалить диалог",
  });

  async function handleSaveContact() {
    if (!conversationId || isSaving) return;
    setIsSaving(true);
    closeDropdown();
    try {
      await conversationService.saveConversationUser(Number(conversationId));
      showNotification({ variant: "success", title: "Контакт сохранён" });
    } catch {
      showNotification({
        variant: "error",
        title: "Не удалось сохранить контакт",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleDeleteClick() {
    if (!conversationId) return;
    deleteTargetIdRef.current = Number(conversationId);
    closeDropdown();
    deleteModal.open();
  }

  function handleCreateAppointment() {
    if (!currentConversation?.user_id) return;
    closeDropdown();
    navigate(`${ROUTES.APPOINTMENTS.ADD_APPOINTMENT}?userId=${currentConversation.user_id}`);
  }

  return (
    <div className="sticky flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 xl:px-6">
      <div className="flex items-center gap-3">
        {isLoading ? (
          <Loader text="..." height={20} />
        ) : (
          <>
            <div className="relative h-12 w-12 shrink-0">
              <div className="absolute inset-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                {currentConversation?.photo_url ? (
                  <img
                    src={currentConversation.photo_url}
                    alt={currentConversation.user || "profile"}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">
                    <SvgIcon name="user" width={32} />
                  </div>
                )}
              </div>
              {currentConversation?.last_message_at &&
                isRecentlyActive(currentConversation.last_message_at) && (
                  <span
                    className="absolute -bottom-px -right-px block h-3 w-3 shrink-0 rounded-full border-2 border-white bg-success-500 dark:border-gray-800"
                    aria-hidden
                  />
                )}
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {currentConversation?.user || t("undefinedUser")}
              </h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentConversation?.source || t("undefinedSource")}
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
                onItemClick={handleSaveContact}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Сохранить контакт
              </DropdownItem>
              <DropdownItem
                tag="a"
                to={
                  currentConversation?.user_id != null
                    ? `${ROUTES.USERS.INDEX}/${currentConversation.user_id}`
                    : undefined
                }
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Подробнее
              </DropdownItem>
              <DropdownItem
                onItemClick={handleCreateAppointment}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Создать запись
              </DropdownItem>
              <DropdownItem
                onItemClick={handleDeleteClick}
                className="flex w-full font-normal text-left text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
              >
                Удалить
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        isLoading={deleteModal.isLoading}
        onClose={deleteModal.close}
        onConfirm={deleteModal.confirm}
        title="Удалить диалог?"
        description="Это действие нельзя отменить."
        itemName={currentConversation?.user}
      />
    </div>
  );
}
