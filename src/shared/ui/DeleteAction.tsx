import { ReactNode, useState } from "react";
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

  return (
    <>
      {children(open)}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        isLoading={deleteModal.isLoading}
        onClose={deleteModal.close}
        onConfirm={deleteModal.confirm}
        itemName={itemName}
      />
    </>
  );
}
