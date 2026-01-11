import React, {useEffect, useState} from "react";
import TableDropdown from "../common/TableDropdown";
import type { Appointment } from "../../entities/appointments/model";
import { apiClient } from "../../api/client";
import Pages from "../../shared/ui/Pages.tsx";
import SvgIcon from "../../shared/ui/SvgIcon";
import { StatusBadge } from "../../shared/ui/StatusBadge";
import { formatDate } from "../../shared/lib/formatDate";
import { useNavigate } from "react-router";
import { ROUTES } from "../../shared/config/routes";
import { FilterTabs } from "../../shared/ui/FilterTabs";
import Loader from "../../shared/ui/Loader";
import { ConfirmDeleteModal } from "../../shared/ui/ConfirmDeleteModal";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";

interface Appointments {
  data: Appointment[];
  meta: {
    from: number;
    in: number;
    count: number;
    limit: number;
    page: number;
    last: number;
  };
}

const APPOINTMENT_FILTERS = [
  { value: "", label: "Все" },
  { value: "initial", label: "Ожидают" },
  { value: "processing", label: "В процессе" },
  { value: "completed", label: "Завершен" },
  { value: "cancelled", label: "Отменен" },
]

export default function AppointmentListTable() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pages, setPages] = useState<Appointments["meta"]>({
    page: 1,
    count: 0,
    limit: 0,
    from: 0,
    in: 0,
    last: 0
  });
  const [page, setPage] = useState<number>(pages.page);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        let path = `/orders?page=${page}`
        if (filter) path += `&q[state_eq]=${filter}`
        const data = await apiClient.get<Appointments>(path, true);
        setAppointments(data.data);
        setPages(data.meta);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load appointments";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [page, filter]);

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isAllSelected = appointments.length > 0 && appointments.every(a => selected.has(a.id));

  const toggleSelectAll = () => {
    setSelected(_prev => {
      if (isAllSelected) return new Set();
      return new Set(appointments.map(a => a.id));
    });
  };

  const deleteModal = useConfirmDelete({
    onDelete: () =>
      apiClient.delete(`/orders/${appointmentToDelete}`, true),
    onSuccess: () =>
      setAppointments((prev) =>
        prev.filter((a) => a.id !== appointmentToDelete)
      ),
    successMessage: "Запись удалена",
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Записи
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Список записей
          </p>
        </div>
        <div className="flex gap-3.5">
          <FilterTabs value={filter} onChange={setFilter} options={APPOINTMENT_FILTERS} onPageChange={setPage} />

          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <SvgIcon name="search" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      { isLoading && <Loader text="Загрузка записей..." />}

      { error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          Ошибка: {error}
        </div>
      )}

      { appointments.length === 0 && (
        <div className="text-center text-gray-500 py-8 dark:text-gray-400">
          Записи не найдены
        </div>
      )}

      { appointments.length > 0 && !isLoading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                  <th className="p-4">
                    <div className="flex w-full cursor-pointer items-center justify-between">
                      <div className="flex items-center gap-3">
                        <label className="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                          <span className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={isAllSelected}
                              onChange={toggleSelectAll}
                            />
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                                isAllSelected
                                  ? "border-brand-500 bg-brand-500"
                                  : "bg-transparent border-gray-300 dark:border-gray-700"
                              }`}
                            >
                              <span
                                className={
                                  isAllSelected
                                    ? ""
                                    : "opacity-0"
                                }
                              >
                                <SvgIcon name="check" width={12} />
                              </span>
                            </span>
                          </span>
                        </label>
                        <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                          №
                        </p>
                      </div>
                    </div>
                  </th>
                  <th
                    className="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400"
                    // onClick={() => sortBy("customer")}
                  >
                    <div className="flex items-center gap-3">
                      <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                        Клиент
                      </p>
                      <span className="flex flex-col gap-0.5">
                        <svg
                          // className={
                          //   sort.sortBy === "customer" &&
                          //   sort.sortDirection === "asc"
                          //     ? "text-gray-500"
                          //     : "text-gray-300"
                          // }
                          width="8"
                          height="5"
                          viewBox="0 0 8 5"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                            fill="currentColor"
                          />
                        </svg>
                        <svg
                          // className={
                          //   sort.sortBy === "customer" &&
                          //   sort.sortDirection === "desc"
                          //     ? "text-gray-500"
                          //     : "text-gray-300"
                          // }
                          width="8"
                          height="5"
                          viewBox="0 0 8 5"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    Создано
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    Дата записи
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    Сумма
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    Статус
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    <div className="relative">
                      <span className="sr-only">Действия</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-x divide-y divide-gray-200 dark:divide-gray-800">
                {appointments.map((appointment: Appointment) => (
                  <tr
                    key={appointment.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <div className="group flex items-center gap-3">
                        <label className="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                          <span className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={selected.has(appointment.id)}
                              onChange={() => toggleRow(appointment.id)}
                            />
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                                selected.has(appointment.id)
                                  ? "border-brand-500 bg-brand-500"
                                  : "bg-transparent border-gray-300 dark:border-gray-700"
                              }`}
                            >
                              <span
                                className={
                                  selected.has(appointment.id) ? "" : "opacity-0"
                                }
                              >
                                <SvgIcon name="check" width={12} />
                              </span>
                            </span>
                          </span>
                        </label>
                        <p className="text-theme-xs font-medium text-gray-700 group-hover:underline dark:text-gray-400">
                          {appointment.id}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                        {appointment.client_full_name}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        {formatDate(appointment.created_at)}
                      </p>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        {formatDate(appointment.appointment_at)}
                      </p>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        {appointment.price}₽
                      </p>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge state={appointment.state} />
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="relative flex justify-center dropdown">
                        <TableDropdown
                          dropdownButton={
                            <button className="text-gray-500 dark:text-gray-400 ">
                              <svg
                                className="fill-current"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z"
                                  fill=""
                                />
                              </svg>
                            </button>
                          }
                          dropdownContent={
                            <>
                              <button 
                                onClick={() => navigate(`${ROUTES.APPOINTMENTS.INDEX}/${appointment.id}`)}
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              >
                                Подробнее
                              </button>
                              <button 
                                onClick={() => {
                                  setAppointmentToDelete(appointment.id);
                                  deleteModal.open();
                                  }}
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              >
                                Удалить
                              </button>
                            </>
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center flex-col sm:flex-row justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
            <Pages
              pages={pages}
              onChange={setPage}
            />
          </div>
        </>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        isLoading={deleteModal.isLoading}
        onClose={deleteModal.close}
        onConfirm={deleteModal.confirm}
        itemName={`Запись #${appointmentToDelete}`}
      />
    </div>
  );
};
