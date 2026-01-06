import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Подтверждение удаления",
  message = "Вы уверены, что хотите удалить этот элемент?",
  itemName,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-6 lg:p-8 sm:m-4 sm:rounded-3xl"
      showCloseButton={true}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
          {title}
        </h4>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {message}
        </p>
        
        {itemName && (
          <p className="text-sm font-medium text-gray-800 dark:text-white/90 mb-6">
            {itemName}
          </p>
        )}
        
        {!itemName && (
          <div className="mb-6"></div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto bg-error-500 hover:bg-error-600 text-white"
          >
            {isLoading ? "Удаление..." : "Удалить"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

