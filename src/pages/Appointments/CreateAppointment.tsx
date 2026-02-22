import { useState, useEffect, useRef } from "react";
import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import Label from "../../components/form/Label.tsx";
import DatePicker from "../../components/form/date-picker.tsx";
import UserAutocomplete from "../../components/form/UserAutocomplete.tsx";
import type { User } from "../../entities/user/model.ts";
// import AppointmentItemPreview from "../../components/appointments/AppointmentItemPreview.tsx";
import AppointmentItems from "../../components/appointments/AppointmentItems.tsx";
import Button from "../../components/ui/button/Button.tsx";
import Input from "../../components/form/input/InputField.tsx";
import SvgIcon from "../../shared/ui/SvgIcon.tsx";
import { appointmentService } from "../../api/appointmet.ts";
import {useNotification} from "../../context/NotificationContext.tsx";
import { Appointment } from "../../entities/appointments/model.ts";
import { useSearchParams } from "react-router";
import type { AppointmentItem } from "../../api/appointmetItems.ts";
import { userService } from "../../api/users.ts";
import Loader from "../../shared/ui/Loader";

type AppointmentFormData = {
  client_id: number | null;
  state: Appointment["state"];
  comment: string;
  appointment_at: string;
  paid: boolean;
  paid_at: string;
  deposit: number;
};

export default function CreateAppointment() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [appointmentItems, setAppointmentItems] = useState<AppointmentItem[]>([]);
  const [searchParams] = useSearchParams();

  const { showNotification } = useNotification();
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const hasCreatedRef = useRef(false);
  const lastSavedKeyRef = useRef<string>("");
  const saveTimeoutRef = useRef<number | null>(null);

  const [formData, setFormData] = useState<AppointmentFormData>({
    client_id: null,
    state: "initial",
    comment: "",
    appointment_at: "",
    paid: false,
    paid_at: "",
    deposit: 0,
  });

  const normalizeAppointmentItems = (items: any[] | undefined | null): AppointmentItem[] => {
    if (!items) return [];
    return items.map((item: any) => ({
      ...item,
      id: typeof item.id === "string" ? parseInt(item.id, 10) : item.id,
      order_id: typeof item.order_id === "string" ? parseInt(item.order_id, 10) : item.order_id,
      service_id: typeof item.service_id === "string" ? parseInt(item.service_id, 10) : item.service_id,
      car_id: typeof item.car_id === "string" ? parseInt(item.car_id, 10) : (item.car_id || 0),
      price: typeof item.price === "string" ? parseFloat(item.price) : Number(item.price) || 0,
      materials_price: typeof item.materials_price === "string" ? parseFloat(item.materials_price) : Number(item.materials_price) || 0,
      delivery_price: typeof item.delivery_price === "string" ? parseFloat(item.delivery_price) : Number(item.delivery_price) || 0,
      paid: typeof item.paid === "string" ? item.paid === "true" : Boolean(item.paid),
    }));
  };

  useEffect(() => {
    // Создаём запись один раз при заходе на /appointments/add
    if (hasCreatedRef.current) return;
    hasCreatedRef.current = true;

    setIsCreating(true);
    setCreateError(null);

    const userIdParam = searchParams.get("userId");
    const userId = userIdParam ? Number(userIdParam) : null;

    const payload: Partial<Appointment> = { state: "initial" };
    if (userId && !Number.isNaN(userId)) {
      payload.client_id = userId;
    }

    appointmentService.createAppointment(payload)
      .then(async (created) => {
        setAppointmentId(created.id);

        // Подставляем созданные значения (если backend что-то вернул)
        const nextFormData: AppointmentFormData = {
          client_id: created.client_id ?? null,
          state: created.state ?? "initial",
          comment: created.comment ?? "",
          appointment_at: created.appointment_at ?? "",
          paid: created.paid ?? false,
          paid_at: created.paid_at ?? "",
          deposit: created.deposit ?? 0,
        };
        setFormData(nextFormData);
        lastSavedKeyRef.current = JSON.stringify({
          client_id: nextFormData.client_id,
          state: nextFormData.state,
          appointment_at: nextFormData.appointment_at,
          paid: nextFormData.paid,
          paid_at: nextFormData.paid_at,
          deposit: nextFormData.deposit,
        });

        // Если backend вернул позиции сразу — покажем их
        if (created.order_items && created.order_items.length > 0) {
          setAppointmentItems(normalizeAppointmentItems(created.order_items));
        }

        // Если клиент указан — загрузим данные пользователя и позиции записи
        if (created.client_id) {
          setIsLoadingUser(true);
          try {
            const [user, fullAppointment] = await Promise.all([
              userService.getUser(created.client_id),
              appointmentService.getAppointment(created.id),
            ]);
            setSelectedUser(user);

            if (fullAppointment.order_items && fullAppointment.order_items.length > 0) {
              setAppointmentItems(normalizeAppointmentItems(fullAppointment.order_items));
            }
          } catch (e) {
            console.error("Failed to load appointment details:", e);
            // User loading failure should not break the page
            setSelectedUser((prev) => prev);
          } finally {
            setIsLoadingUser(false);
          }
        }
      })
      .catch((e) => {
        console.error("Failed to create appointment:", e);
        setCreateError("Не удалось создать запись");
        showNotification({
          variant: "error",
          title: "Ошибка создания",
          description: "Не удалось создать запись",
        });
      })
      .finally(() => {
        setIsCreating(false);
      });
  }, [searchParams, showNotification]);

  const handleUserChange = (user: User | null) => {
    setSelectedUser(user);
    const client_id = user ? user.id : null;
    handleChange("client_id", client_id);
  };

  const handleChange = (
    field: keyof typeof formData,
    value: string | boolean | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveNow = async (): Promise<boolean> => {
    if (!appointmentId) return false;
    if (isCreating) return false;

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    setIsAutoSaving(true);
    try {
      await appointmentService.updateAppointment(appointmentId, {
        client_id: formData.client_id ?? undefined,
        state: formData.state,
        comment: formData.comment,
        appointment_at: formData.appointment_at,
        paid: formData.paid,
        paid_at: formData.paid_at,
        deposit: formData.deposit,
      });

      lastSavedKeyRef.current = JSON.stringify({
        client_id: formData.client_id,
        state: formData.state,
        appointment_at: formData.appointment_at,
        paid: formData.paid,
        paid_at: formData.paid_at,
        deposit: formData.deposit,
      });
      return true;
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка сохранения",
        description: error instanceof Error ? error.message : "Не удалось сохранить запись",
      });
      return false;
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleManualSave = async () => {
    const ok = await saveNow();
    if (!ok) return;
    showNotification({
      variant: "success",
      title: "Сохранено",
      description: "Запись обновлена",
    });
  };

  useEffect(() => {
    if (!appointmentId) return;
    if (isCreating) return;
    if (!formData.client_id) return;

    const key = JSON.stringify({
      client_id: formData.client_id,
      state: formData.state,
      appointment_at: formData.appointment_at,
      paid: formData.paid,
      paid_at: formData.paid_at,
      deposit: formData.deposit,
    });

    if (key === lastSavedKeyRef.current) return;

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      void saveNow();
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, isCreating, formData.client_id, formData.state, formData.appointment_at, formData.paid, formData.paid_at, formData.deposit]);

  return (
    <>
      <PageMeta
        title="Создать запись | CRM"
        description="Добавление новой записи в CRM систему"
      />
      <PageBreadcrumb pageTitle="Запись" />

      {isCreating && (
        <div className="mb-6">
          <Loader text="Создаём запись..." />
        </div>
      )}

      {createError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">{createError}</p>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-medium text-gray-800 dark:text-white">
              Добавить запись
            </h2>
            {appointmentId && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {isAutoSaving ? "Сохранение..." : ""}
              </div>
            )}
          </div>
        </div>
        <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <UserAutocomplete
                  key={selectedUser?.id || 'empty'}
                  label="Клиент"
                  placeholder={isLoadingUser ? "Загрузка пользователя..." : "Введите имя или номер телефона"}
                  value={selectedUser}
                  onChange={handleUserChange}
                  disabled={isLoadingUser}
                />
              </div>
              <div>
                <DatePicker
                  id="appointment-date"
                  label="Дата записи"
                  placeholder="Выберите дату"
                  defaultDate={formData.appointment_at || undefined}
                  onChange={(_dates, dateStr) => {
                    handleChange("appointment_at", dateStr || "");
                  }}
                />
              </div>
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
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="paid"
                  checked={formData.paid}
                  onChange={(e) => handleChange("paid", e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
                />
                <Label htmlFor="paid">Оплачено</Label>
              </div>
              <div>
                <DatePicker
                  id="paid-at-date"
                  label="Дата оплаты"
                  placeholder="Выберите дату"
                  defaultDate={formData.paid_at || undefined}
                  onChange={(_dates, dateStr) => {
                    handleChange("paid_at", dateStr || "");
                  }}
                />
              </div>
              <div>
                <Label>Депозит</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.deposit}
                  onChange={(e) => handleChange("deposit", Number(e.target.value))}
                />
              </div>
            </div>
            <Label>Комментарий</Label>
            <textarea
              className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Введите коментарий..."
              value={formData.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
              onBlur={() => void saveNow()}
              rows={3}
            ></textarea>
          </form>
        </div>
        <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800">
          {appointmentId && formData.client_id ? (
            <AppointmentItems 
              appointmentId={appointmentId}
              clientId={formData.client_id} 
              items={appointmentItems}
              onItemsChange={setAppointmentItems}
            />
          )
        : (
          <div className="text-center text-gray-500 py-8 dark:text-gray-400">
            {appointmentId ? "Для добавления услуг необходимо выбрать клиента" : "Создаём запись..."}
          </div>
        )}
        </div>

        <div className="p-4 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={handleManualSave}
              disabled={isAutoSaving || isCreating || !appointmentId}
            >
              <SvgIcon name="save" />
              {isAutoSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
