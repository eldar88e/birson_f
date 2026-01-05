import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "../ui/button/Button";
import CreateInvoiceTable from "../ecommerce/create-invoice/CreateInvoiceTable";
import { apiClient } from "../../api/client";
import type { Appointment } from "../../entities/appointments/model";
import type { User } from "../../entities/user/model";
import type { Car } from "../../entities/car/model";
import { formatDate } from "../../shared/lib/formatDate";
import { StatusBadge } from "../../shared/ui/StatusBadge";
import { useNavigate } from "react-router";

export default function AppointmentMain() {
  const navigate = useNavigate();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;

      setIsLoading(true);
      setError("");
      try {
        const data = await apiClient.get<{ order: Appointment }>(
          `/orders/${appointmentId}`,
          true
        );
        setAppointment(data.order);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Не удалось загрузить запись";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-500"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Загрузка записи...</p>
        </div>
      </div>
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

  const getClientDisplayName = (client: string | User): string => {
    if (typeof client === "string") {
      return client;
    }
    // If client is an object (User), use full_name or construct from name parts
    if (client.full_name) {
      return client.full_name;
    }
    const parts = [client.first_name, client.middle_name, client.last_name].filter(Boolean);
    return parts.join(" ") || client.email || `ID: ${client.id}`;
  };

  // Helper function to get car display name
  const getCarDisplayName = (car: string | Car): string => {
    if (typeof car === "string") {
      return car;
    }
    // If car is an object (Car), construct display name from brand, model, license_plate
    const parts = [car.brand, car.model, car.license_plate].filter(Boolean);
    return parts.join(" ") || `ID: ${car.id}`;
  };

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
              {getClientDisplayName(appointment.client) || "Не указан"}
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
            <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
              Автомобиль
            </span>

            <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
              {getCarDisplayName(appointment.car) || "Не указан"}
            </h5>

            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Дата записи:
            </span>

            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {appointment.appointment_at ? formatDate(appointment.appointment_at) : "Не указана"}
            </span>
          </div>
        </div>

        {/* Order Items Table */}
        <CreateInvoiceTable orderId={appointment.id} />

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button onClick={() => navigate(`/appointments/${appointment.id}/edit`)}>Редактировать</Button>
        </div>
      </div>
    </div>
  );
}
