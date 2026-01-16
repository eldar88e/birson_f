import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { serviceService, type CreateServiceData } from "../../api/services";
import { useNotification } from "../../context/NotificationContext";
import type { Service } from "../../entities/service/model";
import Button from "../ui/button/Button";

interface ServiceModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  onSuccess?: (service: Service) => void;
}

export default function ServiceModal({ isModalOpen, onClose, service, onSuccess }: ServiceModalProps) {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateServiceData>({
    title: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        event.stopPropagation();
        event.preventDefault();
        onClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape, true); // Используем capture phase
    }

    return () => {
      document.removeEventListener("keydown", handleEscape, true);
    };
  }, [isModalOpen, onClose]);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
      });
    } else {
      setFormData({
        title: "",
      });
    }
  }, [service, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Предотвращаем всплытие к родительскому Modal

    if (!formData.title.trim()) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Необходимо указать название услуги",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result: Service;
      
      if (service) {
        result = await serviceService.updateService(service.id, formData as CreateServiceData);
        showNotification({
          variant: "success",
          title: "Услуга обновлена!",
          description: "Услуга успешно отредактирована",
        });
      } else {
        result = await serviceService.createService(formData);
        showNotification({
          variant: "success",
          title: "Услуга создана!",
          description: "Новая услуга успешно добавлена",
        });
      }

      onSuccess?.(result);
    } catch (error) {
      showNotification({
        variant: "error",
        title: service ? "Ошибка обновления" : "Ошибка создания",
        description: error instanceof Error ? error.message : "Не удалось сохранить услугу",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen || typeof document === 'undefined') return null;

  const modalContent = (
    <>
      <div 
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        style={{ zIndex: 100001, pointerEvents: 'auto' }}
        
        onClick={() => {
            onClose();
        }}
      />
      <div 
        className="fixed inset-0 flex items-center justify-center overflow-y-auto pointer-events-none"
        style={{ zIndex: 100002 }}
      >
        <div
          ref={modalRef}
          className="relative w-full rounded-3xl bg-white dark:bg-gray-900 max-w-[500px] p-6 lg:p-8 overflow-y-auto shadow-lg pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
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
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div>
            <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
              {service ? "Редактировать услугу" : "Добавить новую услугу"}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Название услуги *</Label>
                <Input
                  type="text"
                  placeholder="Введите название услуги"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Сохранение..." : service ? "Сохранить" : "Добавить"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
