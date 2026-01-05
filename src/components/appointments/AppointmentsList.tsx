import React, {useEffect, useMemo, useState} from "react";
import TableDropdown from "../common/TableDropdown";
import type { Appointment } from "../../entities/appointments/model";
import { apiClient } from "../../api/client";
import Pages from "../../shared/ui/Pages.tsx";
import SvgIcon from "../../shared/ui/SvgIcon";

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

type UISortKey = "customer" | "created_at" | "appointment_at";

interface SortState {
  sortBy: UISortKey;
  sortDirection: "asc" | "desc";
}

const sortKeyMap: Record<UISortKey, keyof Appointment> = {
  customer: "client",
  created_at: "created_at",
  appointment_at: "appointment_at"
};

const FilterDropdown: React.FC<{
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
}> = ({ showFilter, setShowFilter }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setShowFilter]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        onClick={() => setShowFilter(!showFilter)}
        type="button"
      >
        <SvgIcon name="filter" />
        Фильтр
      </button>
      {showFilter && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <input
              type="text"
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Search category..."
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Customer
            </label>
            <input
              type="text"
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Search customer..."
            />
          </div>
          <button className="bg-brand-500 hover:bg-brand-600 h-10 w-full rounded-lg px-3 py-2 text-sm font-medium text-white">
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

const AppointmentListTable: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [meta, setMeta] = useState<Appointments["meta"]>({
    page: 1,
    count: 40,
    limit: 20,
    from: 1,
    in: 20,
    last: 2
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [sort, setSort] = useState<SortState>({
    sortBy: "customer",
    sortDirection: "asc",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<"All" | "initial" | "processing" | "completed" | "cancelled">("All");
  const [search, setSearch] = useState<string>("");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient.get<Appointments>("/orders", true);
        setAppointments(data.data);
        setMeta(data.meta);
        setCurrentPage(data.meta.page);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load appointments";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const itemsPerPage: number = meta.limit;
  const totalPages: number = Math.ceil(meta.count / meta.limit);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredAppointments: Appointment[] = useMemo(() => {
    return filterStatus === "All"
      ? appointments
      : appointments.filter((appointment) => appointment.state === filterStatus);
  }, [appointments, filterStatus]);

  const searchedAppointments: Appointment[] = React.useMemo(() => {
    if (!search.trim()) return filteredAppointments;

    return filteredAppointments.filter(
      (appointment) =>
        appointment.id === Number(search)
    );
  }, [filteredAppointments, search]);

  const sortedAppointments = useMemo(() => {
    const key = sortKeyMap[sort.sortBy];

    return [...searchedAppointments].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA < valB) return sort.sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sort.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [searchedAppointments, sort]);

  const paginatedAppointments: Appointment[] = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = (): void => {
    if (
      paginatedAppointments.length > 0 &&
      paginatedAppointments.every((i) => selected.includes(i.id))
    ) {
      setSelected([]);
    } else {
      setSelected(paginatedAppointments.map((i) => i.id));
    }
  };

  const toggleRow = (id: number): void => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const sortBy = (
    field: "customer" | "created_at" | "appointment_at"
  ): void => {
    setSort((prev) => ({
      sortBy: field,
      sortDirection:
        prev.sortBy === field && prev.sortDirection === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Загрузка записей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
        Ошибка: {error}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 dark:text-gray-400">
        Записи не найдены
      </div>
    );
  }

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
          <div className="hidden h-11 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 lg:inline-flex dark:bg-gray-900">
            <button
              onClick={() => {
                setFilterStatus("All");
                setCurrentPage(1);
              }}
              className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
                filterStatus === "All"
                  ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Все
            </button>
            <button
              onClick={() => {
                setFilterStatus("initial");
                setCurrentPage(1);
              }}
              className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
                filterStatus === "initial"
                  ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Ожидают
            </button>
            <button
              onClick={() => {
                setFilterStatus("processing");
                setCurrentPage(1);
              }}
              className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
                filterStatus === "processing"
                  ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              В процессе
            </button>
          </div>
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
            <FilterDropdown
              showFilter={showFilter}
              setShowFilter={setShowFilter}
            />
          </div>
        </div>
      </div>
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
                          checked={
                            paginatedAppointments.length > 0 &&
                            paginatedAppointments.every((i) =>
                              selected.includes(i.id)
                            )
                          }
                          onChange={toggleSelectAll}
                        />
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                            paginatedAppointments.length > 0 &&
                            paginatedAppointments.every((i) =>
                              selected.includes(i.id)
                            )
                              ? "border-brand-500 bg-brand-500"
                              : "bg-transparent border-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <span
                            className={
                              paginatedAppointments.length > 0 &&
                              paginatedAppointments.every((i) =>
                                selected.includes(i.id)
                              )
                                ? ""
                                : "opacity-0"
                            }
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="white"
                                strokeWidth="1.6666"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
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
                onClick={() => sortBy("customer")}
              >
                <div className="flex items-center gap-3">
                  <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                    Клиент
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.sortBy === "customer" &&
                        sort.sortDirection === "asc"
                          ? "text-gray-500"
                          : "text-gray-300"
                      }
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
                      className={
                        sort.sortBy === "customer" &&
                        sort.sortDirection === "desc"
                          ? "text-gray-500"
                          : "text-gray-300"
                      }
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
                Авто
              </th>
              <th
                className="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400"
                onClick={() => sortBy("created_at")}
              >
                <div className="flex items-center gap-3">
                  <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                    Создано
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.sortBy === "created_at" &&
                        sort.sortDirection === "asc"
                          ? "text-gray-500"
                          : "text-gray-300"
                      }
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
                      className={
                        sort.sortBy === "created_at" &&
                        sort.sortDirection === "desc"
                          ? "text-gray-500"
                          : "text-gray-300"
                      }
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
              <th
                className="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400"
                onClick={() => sortBy("appointment_at")}
              >
                <div className="flex items-center gap-3">
                  <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                    Дата записи
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.sortBy === "appointment_at" &&
                        sort.sortDirection === "asc"
                          ? "text-gray-500"
                          : "text-gray-300"
                      }
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
                      className={
                        sort.sortBy === "appointment_at" &&
                        sort.sortDirection === "desc"
                          ? "text-gray-500"
                          : "text-gray-300"
                      }
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
                          checked={selected.includes(appointment.id)}
                          onChange={() => toggleRow(appointment.id)}
                        />
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                            selected.includes(appointment.id)
                              ? "border-brand-500 bg-brand-500"
                              : "bg-transparent border-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <span
                            className={
                              selected.includes(appointment.id) ? "" : "opacity-0"
                            }
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="white"
                                strokeWidth="1.6666"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
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
                    {appointment.client}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    {appointment.car}
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
                  <span
                    className={`text-theme-xs rounded-full px-2 py-0.5 font-medium ${
                      appointment.state === "completed"
                        ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500"
                        : appointment.state === "processing" 
                        ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500"
                        : appointment.state === "cancelled"
                        ? "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400"
                    }`}
                  >
                    {appointment.state}
                  </span>
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
                          <button className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            View More
                          </button>
                          <button className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            Delete
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
        <div className="pb-3 sm:pb-0">
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing{" "}
            <b>{meta.from}</b>{" "}
            to{" "}
            <b>{meta.in}</b>{" "}
            of{" "}
            <b>{meta.count}</b>
          </span>
        </div>
        <Pages
          page={currentPage}
          lastPages={totalPages}
          onChange={handleGoToPage}
        />
      </div>
    </div>
  );
};

export default AppointmentListTable;
