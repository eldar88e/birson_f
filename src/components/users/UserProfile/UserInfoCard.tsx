import { useState } from "react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { apiClient } from "../../../api/client";
import type { User } from "../../../entities/user/model";
import { useNotification } from "../../../context/NotificationContext";
import { USER_POSITIONS, USER_ROLES } from "../../../entities/user/model";
import SvgIcon from "../../../shared/ui/SvgIcon";

interface UserInfoCardProps {
  user: User;
}

export default function UserInfoCard({ user }: UserInfoCardProps) {
  const { showNotification } = useNotification();
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    middle_name: user.middle_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    additional_phone: user.additional_phone || "",
    role: user.role,
    comment: user.comment || "",
    position: user.position,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.put(`/users/${user.id}`, formData, true);
      closeModal();
      showNotification({
        variant: "success",
        title: "Сохранено!",
        description: "Данные обновлены",
      });
    } catch {
      showNotification({
        variant: "error",
        title: "Ошибка!",
        description: "Не удалось сохранить данные",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Личная информация
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-7 2xl:gap-x-32">
          <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Фамилия
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.last_name || "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Имя
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.first_name || "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Отчество
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.middle_name || "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Телефон
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.phone || "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Доп. телефон
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.additional_phone || "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Роль
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.role}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Роль
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.position}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <SvgIcon name="pencil" width={18} />
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Редактировать информацию
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Обновите данные пользователя
            </p>
          </div>
          <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Личная информация
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>Фамилия</Label>
                    <Input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                      placeholder="Иванов"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Имя</Label>
                    <Input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleChange("first_name", e.target.value)}
                      placeholder="Иван"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Отчество</Label>
                    <Input
                      type="text"
                      value={formData.middle_name}
                      onChange={(e) => handleChange("middle_name", e.target.value)}
                      placeholder="Иванович"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Телефон</Label>
                    <Input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+79001234567"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Доп. телефон</Label>
                    <Input
                      type="text"
                      value={formData.additional_phone}
                      onChange={(e) => handleChange("additional_phone", e.target.value)}
                      placeholder="+79001234567"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Роль</Label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    >
                      {USER_ROLES.map((role) => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Должность</Label>
                    <select
                      value={formData.position}
                      onChange={(e) => handleChange("position", e.target.value)}
                      className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    >
                      {USER_POSITIONS.map((position) => (
                        <option key={position.value} value={position.value}>{position.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <Label>Комментарий</Label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => handleChange("comment", e.target.value)}
                      placeholder="Дополнительная информация..."
                      rows={3}
                      className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    />
                  </div>
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
    </div>
  );
}
