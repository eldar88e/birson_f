import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState, useEffect } from "react";
import { useNotification } from "../../context/NotificationContext";
import type { Position } from "../../entities/position/model";
import { CreatePositionData, positionService } from "../../api/position";

interface PositionModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  position?: Position | null;
  onSuccess?: (position: Position) => void;
}

export default function PositionModal({ isModalOpen, onClose, position, onSuccess }: PositionModalProps) {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<{
    title: string;
  }>({
    title: "",
  });

  const [errors, setErrors] = useState<{
    title: boolean;
  }>({
    title: false,
  });

  // Заполняем форму при редактировании
  useEffect(() => {
    if (position) {
      setFormData({
        title: position.title,
      });
    } else {
      setFormData({
        title: "",
      });
    }
    setErrors({ title: false });
  }, [position, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверяем обязательные поля
    const newErrors = {
      title: !formData.title.trim(),
    };

    setErrors(newErrors);

    if (newErrors.title) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Название",
      });
      return;
    }

    try {
      const positionData: CreatePositionData = {
        title: formData.title.trim(),
      };

      let updatedPosition: Position;

      if (position?.id) {
        // Редактирование существующей должности
        updatedPosition = await positionService.updatePosition(position.id, positionData);
        showNotification({
          variant: "success",
          title: "Должность обновлена!",
          description: "Должность успешно обновлена",
        });
      } else {
        // Создание новой должности
        updatedPosition = await positionService.createPosition(positionData);
        showNotification({
          variant: "success",
          title: "Должность создана!",
          description: "Новая должность успешно добавлена",
        });
      }

      onSuccess?.(updatedPosition);
      handleClose();
    } catch (error) {
      showNotification({
        variant: "error",
        title: position?.id ? "Ошибка обновления" : "Ошибка создания",
        description: `Не удалось ${position?.id ? "обновить" : "создать"} должность. ${error}`,
      });
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      title: "",
    });
    setErrors({
      title: false,
    });
  };

  return (
    <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
            {position?.id ? "Редактировать должность" : "Добавить новую должность"}
          </h4>
          <form className="space-y-4">
            <div>
              <Label>Название *</Label>
              <Input
                type="text"
                placeholder="Введите название должности"
                value={formData.title}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, title: e.target.value }));
                  // Очищаем ошибку при вводе
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: false }));
                  }
                }}
                error={errors.title}
                hint={errors.title ? "Заполните название должности" : ""}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {position?.id ? "Сохранить" : "Создать"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
  );
}
