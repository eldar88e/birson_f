import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
  title = "Подтвердите удаление",
  description = "Это действие нельзя отменить",
  itemName,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6 lg:p-8 sm:m-4 sm:rounded-3xl">
      <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">{title}</h4>
      <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">{description}</p>

      {itemName && <p className="font-medium mb-6 text-gray-800 dark:text-white/90">{itemName}</p>}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isLoading}
          className="bg-error-500"
        >
          {isLoading ? "Удаление..." : "Удалить"}
        </Button>
      </div>
    </Modal>
  );
}
