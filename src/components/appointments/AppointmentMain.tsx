import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Button from "../ui/button/Button";
import AppointmentItems from "./AppointmentItems";
import { appointmentService } from "../../api/appointmet";
import { userService } from "../../api/users";
import type { Appointment } from "../../entities/appointments/model";
import { formatDate } from "../../shared/lib/formatDate";
import { StatusBadge } from "../../shared/ui/StatusBadge";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../context/NotificationContext";
import Label from "../form/Label";
import DatePicker from "../form/date-picker";
import UserAutocomplete from "../form/UserAutocomplete";
import type { User } from "../../entities/user/model";
import SvgIcon from "../../shared/ui/SvgIcon";
import Loader from "../../shared/ui/Loader";

export default function AppointmentMain() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { showNotification } = useNotification();
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const lastSavedKeyRef = useRef<string>("");
  const saveTimeoutRef = useRef<number | null>(null);
  const [formData, setFormData] = useState<{
    client_id: number;
    state: Appointment["state"];
    comment: string;
    appointment_at: string;
  }>({
    client_id: 0,
    state: "initial",
    comment: "",
    appointment_at: "",
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;

      setIsLoading(true);
      setError("");
      try {
        const appointmentIdNum = parseInt(appointmentId, 10);
        if (isNaN(appointmentIdNum)) throw new Error("Invalid appointment ID");

        const appointmentData = await appointmentService.getAppointment(appointmentIdNum);
        setAppointment(appointmentData);

        if (!appointmentData.client_id) return;

        try {
          const user = await userService.getUser(appointmentData.client_id);
          setSelectedUser(user);
        } catch {
          // Ignore error
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Не удалось загрузить запись";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleOpenEditModal = () => {
    if (!appointment) return;
    
    const nextFormData = {
      client_id: appointment.client_id,
      state: appointment.state,
      comment: appointment.comment || "",
      appointment_at: appointment.appointment_at || "",
    };
    setFormData(nextFormData);
    lastSavedKeyRef.current = JSON.stringify({
      client_id: nextFormData.client_id,
      state: nextFormData.state,
      appointment_at: nextFormData.appointment_at,
    });
    openModal();
  };

  const handleUserChange = (user: User | null) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      client_id: user?.id || 0,
    }));
  };

  const saveNow = async (): Promise<boolean> => {
    if (!appointment || !appointmentId) return false;
    if (!formData.client_id) return false;

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    setIsSaving(true);
    try {
      const updatedAppointment = await appointmentService.updateAppointment(parseInt(appointmentId, 10), {
        client_id: formData.client_id,
        state: formData.state,
        comment: formData.comment,
        appointment_at: formData.appointment_at,
      });

      setAppointment(updatedAppointment);

      lastSavedKeyRef.current = JSON.stringify({
        client_id: formData.client_id,
        state: formData.state,
        appointment_at: formData.appointment_at,
      });
      return true;
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка обновления",
        description: error instanceof Error ? error.message : "Не удалось обновить запись",
      });
      return false;
    } finally {
      setIsSaving(false);
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
    closeModal();
  };

  useEffect(() => {
    if (!isModalOpen) return;
    if (!appointmentId) return;
    if (!appointment) return;
    if (!formData.client_id) return;

    const key = JSON.stringify({
      client_id: formData.client_id,
      state: formData.state,
      appointment_at: formData.appointment_at,
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
  }, [isModalOpen, appointmentId, appointment, formData.client_id, formData.state, formData.appointment_at]);

  if (isLoading) {
    return (
      <Loader text="Загрузка записи..." />
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center text-gray-500 py-8 dark:text-gray-400">
        Запись не найдена
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">
          Запись
        </h3>

        <div className="flex items-center gap-3">
          <StatusBadge state={appointment.state} />
          <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">
            ID : #{appointment.id}
          </h4>
        </div>
      </div>

      <div className="p-5 xl:p-8">
        <div className="flex flex-col gap-6 mb-9 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
              Клиент
            </span>

            <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
              {appointment.client_full_name}
            </h5>

            {appointment.comment && (
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {appointment.comment}
              </p>
            )}

            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Создано:
            </span>

            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {formatDate(appointment.created_at)}
            </span>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-800 sm:h-[158px] sm:w-px"></div>

          <div className="sm:text-right">
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={handleOpenEditModal}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                <SvgIcon name="pencil" width={18} />
              </Button>
            </div>
            <span className="mb-1 block text-sm font-medium text-blue-500 dark:text-blue-400">
              Дата записи:
            </span>

            <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
              {appointment.appointment_at ? formatDate(appointment.appointment_at) : "Не указана"}
            </span>

            <span className="mb-1 block text-sm font-medium text-orange-500 dark:text-orange-400">
              Дата взятия в работу:
            </span>

            <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
              {formatDate(appointment.processing_at)}
            </span>

            <span className="mb-1 block text-sm font-medium text-green-500 dark:text-green-400">
              Дата завершения:
            </span>

            <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
              {formatDate(appointment.completed_at)}
            </span>

            {appointment.cancelled_at && (
              <>
                <span className="mb-1 block text-sm font-medium text-red-500 dark:text-red-400">
                  Дата отмены:
                </span>

                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(appointment.cancelled_at)}
                </span>
              </>
            )}
          </div>
        </div>

        <AppointmentItems appointmentId={appointment.id} clientId={appointment.client_id} items={appointment.order_items} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-[700px] p-4 sm:p-6 lg:p-8 sm:m-4 sm:rounded-3xl"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
            Редактировать запись
          </h4>
          <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Статус *</Label>
                <select
                  value={formData.state}
                  className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, state: e.target.value as Appointment["state"] }))
                  }
                  required
                >
                  <option value="initial">В ожидании</option>
                  <option value="processing">В процессе</option>
                  <option value="completed">Завершен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>

              <div>
                <DatePicker
                  id="edit-appointment-date"
                  label="Дата записи"
                  placeholder="Выберите дату"
                  defaultDate={formData.appointment_at || undefined}
                  onChange={(_dates, dateStr) => {
                    setFormData((prev) => ({ ...prev, appointment_at: dateStr || "" }));
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1">
              <div>
                <UserAutocomplete
                  label="Клиент *"
                  placeholder="Введите имя или номер телефона"
                  value={selectedUser}
                  onChange={handleUserChange}
                />
              </div>
            </div>

            <div>
              <Label>Комментарий</Label>
              <textarea
                className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                placeholder="Введите комментарий..."
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comment: e.target.value }))
                }
                onBlur={() => void saveNow()}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
              >
                Отмена
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleManualSave}
                disabled={isSaving}
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
