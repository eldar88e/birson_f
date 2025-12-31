import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { apiClient } from "../../api/client";

interface User {
  id: number;
  company_name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legal_address: string;
  actual_address: string;
  contact_person: string;
  contact_phone: string;
  bank_name: string;
  bik: string;
  checking_account: string;
  correspondent_account: string;
}

interface UserAddressCardProps {
  user: User;
}

export default function UserAddressCard({ user }: UserAddressCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    company_name: user.company_name || "",
    inn: user.inn || "",
    kpp: user.kpp || "",
    ogrn: user.ogrn || "",
    legal_address: user.legal_address || "",
    actual_address: user.actual_address || "",
    contact_person: user.contact_person || "",
    contact_phone: user.contact_phone || "",
    bank_name: user.bank_name || "",
    bik: user.bik || "",
    checking_account: user.checking_account || "",
    correspondent_account: user.correspondent_account || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.put(`/users/${user.id}`, formData, true);
      console.log("Company info updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Failed to update company info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Реквизиты компании
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Название компании
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.company_name || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  ИНН
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.inn || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  КПП
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.kpp || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  ОГРН
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.ogrn || "—"}
                </p>
              </div>

              <div className="col-span-1 lg:col-span-2">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Юридический адрес
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.legal_address || "—"}
                </p>
              </div>

              <div className="col-span-1 lg:col-span-2">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Фактический адрес
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.actual_address || "—"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Редактировать реквизиты
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Обновите реквизиты компании
            </p>
          </div>
          <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="px-2 overflow-y-auto custom-scrollbar max-h-[500px]">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2">
                  <Label>Название компании</Label>
                  <Input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    placeholder="ООО Компания"
                  />
                </div>

                <div>
                  <Label>ИНН</Label>
                  <Input
                    type="text"
                    value={formData.inn}
                    onChange={(e) => handleChange("inn", e.target.value)}
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <Label>КПП</Label>
                  <Input
                    type="text"
                    value={formData.kpp}
                    onChange={(e) => handleChange("kpp", e.target.value)}
                    placeholder="123456789"
                  />
                </div>

                <div className="col-span-2">
                  <Label>ОГРН</Label>
                  <Input
                    type="text"
                    value={formData.ogrn}
                    onChange={(e) => handleChange("ogrn", e.target.value)}
                    placeholder="1234567890123"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Юридический адрес</Label>
                  <Input
                    type="text"
                    value={formData.legal_address}
                    onChange={(e) => handleChange("legal_address", e.target.value)}
                    placeholder="г. Москва, ул. Примерная, д. 1"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Фактический адрес</Label>
                  <Input
                    type="text"
                    value={formData.actual_address}
                    onChange={(e) => handleChange("actual_address", e.target.value)}
                    placeholder="г. Москва, ул. Примерная, д. 1"
                  />
                </div>

                <div>
                  <Label>Контактное лицо</Label>
                  <Input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => handleChange("contact_person", e.target.value)}
                    placeholder="Иванов Иван Иванович"
                  />
                </div>

                <div>
                  <Label>Контактный телефон</Label>
                  <Input
                    type="text"
                    value={formData.contact_phone}
                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                    placeholder="+79001234567"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Название банка</Label>
                  <Input
                    type="text"
                    value={formData.bank_name}
                    onChange={(e) => handleChange("bank_name", e.target.value)}
                    placeholder="ПАО Сбербанк"
                  />
                </div>

                <div>
                  <Label>БИК</Label>
                  <Input
                    type="text"
                    value={formData.bik}
                    onChange={(e) => handleChange("bik", e.target.value)}
                    placeholder="044525225"
                  />
                </div>

                <div>
                  <Label>Расчетный счет</Label>
                  <Input
                    type="text"
                    value={formData.checking_account}
                    onChange={(e) => handleChange("checking_account", e.target.value)}
                    placeholder="40702810000000000000"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Корреспондентский счет</Label>
                  <Input
                    type="text"
                    value={formData.correspondent_account}
                    onChange={(e) => handleChange("correspondent_account", e.target.value)}
                    placeholder="30101810000000000000"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button">
                Отмена
              </Button>
              <Button size="sm" onClick={handleSave} type="button" disabled={isSaving}>
                {isSaving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
