import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { contractorService, type CreateContractorData, type UpdateContractorData } from "../../api/contractors";
import { useNotification } from "../../context/NotificationContext";
import type { Contractor } from "../../entities/contractor/model";
import Button from "../ui/button/Button";

interface ContractorModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  contractor?: Contractor | null;
  onSuccess?: (contractor: Contractor) => void;
  initialData?: Partial<CreateContractorData>;
}

export default function ContractorModal({ 
  isModalOpen, 
  onClose, 
  contractor, 
  onSuccess,
  initialData 
}: ContractorModalProps) {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateContractorData>({
    name: "",
    entity_type: "individual",
    email: "",
    phone: "",
    inn: "",
    kpp: "",
    legal_address: "",
    contact_person: "",
    bank_name: "",
    bik: "",
    checking_account: "",
    correspondent_account: "",
    service_profile: "",
    active: true,
    comment: "",
    ...initialData,
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
      document.addEventListener("keydown", handleEscape, true);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape, true);
    };
  }, [isModalOpen, onClose]);

  useEffect(() => {
    if (contractor) {
      setFormData({
        name: contractor.name || "",
        entity_type: contractor.entity_type || "",
        email: contractor.email || "",
        phone: contractor.phone || "",
        inn: contractor.inn || "",
        kpp: contractor.kpp || "",
        legal_address: contractor.legal_address || "",
        contact_person: contractor.contact_person || "",
        bank_name: contractor.bank_name || "",
        bik: contractor.bik || "",
        checking_account: contractor.checking_account || "",
        correspondent_account: contractor.correspondent_account || "",
        service_profile: contractor.service_profile || "",
        active: contractor.active ?? true,
        comment: contractor.comment || "",
      });
    } else if (initialData) {
      setFormData({
        name: "",
        entity_type: "individual",
        email: "",
        phone: "",
        inn: "",
        kpp: "",
        legal_address: "",
        contact_person: "",
        bank_name: "",
        bik: "",
        checking_account: "",
        correspondent_account: "",
        service_profile: "",
        active: true,
        comment: "",
        ...initialData,
      });
    } else {
      setFormData({
        name: "",
        entity_type: "individual",
        email: "",
        phone: "",
        inn: "",
        kpp: "",
        legal_address: "",
        contact_person: "",
        bank_name: "",
        bik: "",
        checking_account: "",
        correspondent_account: "",
        service_profile: "",
        active: true,
        comment: "",
      });
    }
  }, [contractor, isModalOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.name.trim()) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательное поле: Название",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result: Contractor;
      
      if (contractor) {
        result = await contractorService.updateContractor(contractor.id, formData as UpdateContractorData);
        showNotification({
          variant: "success",
          title: "Контрагент обновлен!",
          description: "Контрагент успешно отредактирован",
        });
      } else {
        result = await contractorService.createContractor(formData);
        showNotification({
          variant: "success",
          title: "Контрагент создан!",
          description: "Новый контрагент успешно добавлен",
        });
      }

      onSuccess?.(result);
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка создания",
        description: error instanceof Error ? error.message : "Не удалось создать контрагента",
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
          className="relative w-full rounded-3xl bg-white dark:bg-gray-900 max-w-3xl p-4 sm:p-6 lg:p-8 overflow-y-auto shadow-lg pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
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
          <div className="overflow-y-auto max-h-[calc(90vh-2rem)]">
            <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
              {contractor ? "Редактировать контрагента" : "Добавить нового контрагента"}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Название *</Label>
                  <Input
                    type="text"
                    placeholder="Введите название"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Тип организации</Label>
                  <select
                    value={formData.entity_type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, entity_type: e.target.value }))
                    }
                    className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  >
                    <option value="individual">Физическое лицо</option>
                    <option value="legal">Юридическое лицо</option>
                  </select>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Телефон</Label>
                  <Input
                    type="tel"
                    placeholder="+7 (999) 999-99-99"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>ИНН</Label>
                  <Input
                    type="text"
                    placeholder="Введите ИНН"
                    value={formData.inn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, inn: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>КПП</Label>
                  <Input
                    type="text"
                    placeholder="Введите КПП"
                    value={formData.kpp}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, kpp: e.target.value }))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Юридический адрес</Label>
                  <Input
                    type="text"
                    placeholder="Введите юридический адрес"
                    value={formData.legal_address}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, legal_address: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Контактное лицо</Label>
                  <Input
                    type="text"
                    placeholder="Введите контактное лицо"
                    value={formData.contact_person}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contact_person: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Название банка</Label>
                  <Input
                    type="text"
                    placeholder="Введите название банка"
                    value={formData.bank_name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bank_name: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>БИК</Label>
                  <Input
                    type="text"
                    placeholder="Введите БИК"
                    value={formData.bik}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bik: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Расчетный счет</Label>
                  <Input
                    type="text"
                    placeholder="Введите расчетный счет"
                    value={formData.checking_account}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, checking_account: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Корреспондентский счет</Label>
                  <Input
                    type="text"
                    placeholder="Введите корреспондентский счет"
                    value={formData.correspondent_account}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, correspondent_account: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Профиль услуг</Label>
                  <Input
                    type="text"
                    placeholder="Введите профиль услуг"
                    value={formData.service_profile}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, service_profile: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Активен</Label>
                  <div className="flex items-center h-11">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, active: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Да</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label>Комментарий</Label>
                  <textarea
                    className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-24 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    placeholder="Введите комментарий..."
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, comment: e.target.value }))
                    }
                  />
                </div>
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
                  {isSubmitting ? "Сохранение..." : contractor ? "Сохранить" : "Создать"}
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
