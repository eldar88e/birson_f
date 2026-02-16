import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { appointmentService } from "../../api/appointmet";
import type { Appointment } from "../../entities/appointments/model";
import { StatusBadge } from "../../shared/ui/StatusBadge";
import { formatDate } from "../../shared/lib/formatDate";
import Loader from "../../shared/ui/Loader";
import { ROUTES } from "../../shared/config/routes";

export default function RecentOrders() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    appointmentService
      .getAppointments("?q[s]=appointment_at desc&limit=5")
      .then((response) => {
        setAppointments(response.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Последние записи
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.APPOINTMENTS.INDEX)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Все записи
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        {isLoading ? (
          <Loader text="Загрузка записей..." />
        ) : appointments.length === 0 ? (
          <p className="py-6 text-center text-gray-500 dark:text-gray-400">
            Записи не найдены
          </p>
        ) : (
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Клиент
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Дата записи
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Сумма
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Статус
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {appointments.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  onClick={() => navigate(`${ROUTES.APPOINTMENTS.INDEX}/${appointment.id}`)}
                >
                  <TableCell className="py-3">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {appointment.client_full_name}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDate(appointment.appointment_at)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {appointment.price}&#8381;
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge state={appointment.state} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
