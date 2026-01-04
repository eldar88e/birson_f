import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import UserAutocomplete from "../../components/form/UserAutocomplete";
import type { User } from "../../entities/user/model";
import InvoicePreviewModal from "../../components/ecommerce/create-invoice/InvoicePreviewModal";
import CreateInvoiceTable from "../../components/ecommerce/create-invoice/CreateInvoiceTable";
import SvgIcon from "../../shared/ui/SvgIcon.tsx";
import { apiClient } from "../../api/client";
import {useNotification} from "../../context/NotificationContext.tsx";
import { Appointment } from "../../entities/appointments/model";
import {ROUTES} from "../../shared/config/routes.ts";
import {useNavigate} from "react-router";
import Button from "../../components/ui/button/Button";

export default function CreateAppointment() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Appointment>({
    client_id: null,
    car_id: null,
    state: "initial",
    comment: "",
    appointment_at: ""
  });

  const handleUserChange = (user: User) => {
    setSelectedUser(user);
    handleChange("client_id", user.id);
  };

  const handleChange = (field: keyof Appointment, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await apiClient.post<{ order: Appointment }>(
        "/orders",
        { order: formData },
        true
      );

      showNotification({
        variant: "success",
        title: "Запись создана!",
        description: "Новая запись успешно добавлена в систему",
      });

      setTimeout(() => {
        navigate(`${ROUTES.APPOINTMENTS.INDEX}/${response.order.id}`);
      }, 1000);
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка создания",
        description: error instanceof Error ? error.message : "Не удалось создать пользователя",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Создать запись | CRM"
        description="Добавление новой записи в CRM систему"
      />
      <PageBreadcrumb pageTitle="Запись" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-xl font-medium text-gray-800 dark:text-white">
            Добавить запись
          </h2>
        </div>
        <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800">
          <form className="space-y-6" id="create-appointment-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <UserAutocomplete
                  label="Клиент"
                  placeholder="Введите имя или номер телефона"
                  value={selectedUser}
                  onChange={handleUserChange}
                />
              </div>{" "}
              <div>
                <Label>Авто</Label>
                <Input
                  type="text"
                  placeholder="BMW, Audi"
                  value={formData.car_id}
                  onChange={(e) => handleChange("car_id", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Авто</Label>
                <Input
                  type="date"
                  placeholder="2023-09-15"
                  value={formData.appointment_at}
                  onChange={(e) => handleChange("appointment_at", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label>Статус</Label>
                <select
                  value={formData.state}
                  className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  onChange={(e) => handleChange("state", e.target.value as Appointment["state"])}
                >
                  <option value="initial">В ожидании</option>
                  <option value="processing">В процессе</option>
                  <option value="completed">Завершен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>
              <div>
                <Label>Оплата</Label>
                <select className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30">
                  <option value="initial">Не оплачен</option>
                  <option value="processing">Оплачен</option>
                </select>
              </div>{" "}
            </div>
            <Label>Комментарий</Label>
            <textarea
              className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Введите коментарий..."
            ></textarea>
          </form>
        </div>
        <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800">
          <CreateInvoiceTable />
        </div>
        <div className="p-4 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <InvoicePreviewModal />
            <Button
              type="submit"
              form="create-appointment-form"
              variant="primary"
              disabled={isSubmitting}
            >
              <SvgIcon name="save" />
              {isSubmitting ? "Создание..." : "Создать пользователя"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
