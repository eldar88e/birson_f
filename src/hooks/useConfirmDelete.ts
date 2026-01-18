import { useState } from "react";
import { useNotification } from "../context/NotificationContext";

interface UseConfirmDeleteOptions {
  onDelete: () => Promise<void>;
  onSuccess?: () => void;
  successMessage?: string;
  errorMessage?: string;
  useApi?: boolean;
}

export function useConfirmDelete({
  onDelete,
  onSuccess,
  successMessage = "Удалено",
  errorMessage = "Ошибка удаления",
  useApi = true,
}: UseConfirmDeleteOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const confirm = async () => {
    setIsLoading(true);
    try {
      if (useApi) await onDelete();
      close();
      showNotification({ variant: "success", title: successMessage });
      onSuccess?.();
    } catch {
      showNotification({ variant: "error", title: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return { isOpen, isLoading, open, close, confirm };
}
