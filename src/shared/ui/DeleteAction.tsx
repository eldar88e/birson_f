import { ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";

interface DeleteActionProps {
  id: number;
  itemName: string;
  onDelete: (id: number) => Promise<void>;
  onSuccess?: () => void;
  children: (open: () => void) => ReactNode;
}

export function DeleteAction({
  id,
  itemName,
  onDelete,
  onSuccess,
  children,
}: DeleteActionProps) {
  const [currentId, setCurrentId] = useState<number | null>(null);

  const deleteModal = useConfirmDelete({
    onDelete: () => onDelete(currentId!),
    onSuccess,
  });

  const open = () => {
    setCurrentId(id);
    deleteModal.open();
  };

  const handleClose = () => {
    deleteModal.close();
    setCurrentId(null);
  };

  // Очищаем currentId когда модалка закрывается
  useEffect(() => {
    if (!deleteModal.isOpen && currentId !== null) {
      setCurrentId(null);
    }
  }, [deleteModal.isOpen, currentId]);

  return (
    <>
      {children(open)}

      {deleteModal.isOpen && typeof document !== 'undefined' && createPortal(
        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          isLoading={deleteModal.isLoading}
          onClose={handleClose}
          onConfirm={deleteModal.confirm}
          itemName={itemName}
        />,
        document.body
      )}
    </>
  );
}
