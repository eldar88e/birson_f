import React, { useEffect, useMemo, useState } from "react";
import TableDropdown from "../common/TableDropdown";
import { apiClient } from "../../api/client";
import Pagination from "../../shared/ui/Pages";

interface User {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  phone?: string;
  created_at?: string;
  status?: "active" | "inactive";
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient.get<any>("/users", true);

        // Handle different response formats
        const usersList = data.users || data.data || data;
        setUsers(Array.isArray(usersList) ? usersList : []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load users";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [roleFilter, setRoleFilter] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedRole === "All" || user.role?.toLowerCase() === selectedRole.toLowerCase())
        // && (roleFilter === "" || user.role?.toLowerCase().includes(roleFilter.toLowerCase()))
    );
  }, [users, searchQuery, selectedRole]); // , roleFilter

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    if (sortBy) {
      sorted.sort((a, b) => {
        let valA: any = a[sortBy as keyof User];
        let valB: any = b[sortBy as keyof User];

        if (!valA) return 1;
        if (!valB) return -1;

        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredUsers, sortBy, sortAsc]);

  const totalPages = Math.ceil(sortedUsers.length / perPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleToggleAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(paginatedUsers.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleToggleOne = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];
    setSelected(newSelected);
    setSelectAll(newSelected.length === paginatedUsers.length);
  };

  // Get badge style based on role
  const getRoleBadgeClass = (role?: string): string => {
    const roleMap: Record<string, string> = {
      admin: "bg-error-50 dark:bg-error-500/15 text-error-700 dark:text-error-500",
      manager: "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-500",
      staff: "bg-warning-50 dark:bg-warning-500/15 text-warning-600 dark:text-warning-500",
      user: "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500",
    };
    return roleMap[role?.toLowerCase() || "user"] || roleMap.user;
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showFilter &&
        event.target &&
        (event.target as Element).closest &&
        !(event.target as Element).closest(".filter-dropdown")
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showFilter]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Загрузка пользователей...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
        Ошибка: {error}
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 dark:text-gray-400">
        Пользователи не найдены
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Пользователи
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ваши пользователи
          </p>
        </div>
        <div className="flex gap-3.5">
          <div className="hidden h-11 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 lg:inline-flex dark:bg-gray-900">
            {["All", "Admin", "Manager", "Staff", "User"].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
                  selectedRole === role
                    ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                    fill=""
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
            {/*<div className="relative filter-dropdown">*/}
            {/*  <button*/}
            {/*    className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"*/}
            {/*    onClick={() => setShowFilter(!showFilter)}*/}
            {/*    type="button"*/}
            {/*  >*/}
            {/*    <svg*/}
            {/*      xmlns="http://www.w3.org/2000/svg"*/}
            {/*      width="20"*/}
            {/*      height="20"*/}
            {/*      viewBox="0 0 20 20"*/}
            {/*      fill="none"*/}
            {/*    >*/}
            {/*      <path*/}
            {/*        d="M14.6537 5.90414C14.6537 4.48433 13.5027 3.33331 12.0829 3.33331C10.6631 3.33331 9.51206 4.48433 9.51204 5.90415M14.6537 5.90414C14.6537 7.32398 13.5027 8.47498 12.0829 8.47498C10.663 8.47498 9.51204 7.32398 9.51204 5.90415M14.6537 5.90414L17.7087 5.90411M9.51204 5.90415L2.29199 5.90411M5.34694 14.0958C5.34694 12.676 6.49794 11.525 7.91777 11.525C9.33761 11.525 10.4886 12.676 10.4886 14.0958M5.34694 14.0958C5.34694 15.5156 6.49794 16.6666 7.91778 16.6666C9.33761 16.6666 10.4886 15.5156 10.4886 14.0958M5.34694 14.0958L2.29199 14.0958M10.4886 14.0958L17.7087 14.0958"*/}
            {/*        stroke="currentColor"*/}
            {/*        strokeWidth="1.5"*/}
            {/*        strokeLinecap="round"*/}
            {/*        strokeLinejoin="round"*/}
            {/*      />*/}
            {/*    </svg>*/}
            {/*    Filter*/}
            {/*  </button>*/}
            {/*  {showFilter && (*/}
            {/*    <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">*/}
            {/*      <div className="mb-5">*/}
            {/*        <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">*/}
            {/*          Роль*/}
            {/*        </label>*/}
            {/*        <input*/}
            {/*          type="text"*/}
            {/*          name="role"*/}
            {/*          value={roleFilter}*/}
            {/*          onChange={(e) => setRoleFilter(e.target.value)}*/}
            {/*          className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"*/}
            {/*          placeholder="Поиск по роли..."*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*      <div className="flex gap-2">*/}
            {/*        <button*/}
            {/*          className="bg-brand-500 hover:bg-brand-600 h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium text-white"*/}
            {/*          onClick={() => setShowFilter(false)}*/}
            {/*        >*/}
            {/*          Применить*/}
            {/*        </button>*/}
            {/*        <button*/}
            {/*          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"*/}
            {/*          onClick={() => {*/}
            {/*            setRoleFilter("");*/}
            {/*            setSelectedRole("All");*/}
            {/*            setShowFilter(false);*/}
            {/*          }}*/}
            {/*        >*/}
            {/*          Сбросить*/}
            {/*        </button>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 whitespace-nowrap">
                <div className="flex w-full cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                      <span className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectAll}
                          onChange={handleToggleAll}
                        />
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                            selectAll
                              ? "border-brand-500 bg-brand-500"
                              : "bg-transparent border-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <span className={selectAll ? "" : "opacity-0"}>
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
                      ID
                    </p>
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                <div
                  className="flex cursor-pointer items-center justify-between gap-3"
                  onClick={() => handleSort("name")}
                >
                  <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                    ФИО
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sortBy === "name" && sortAsc
                          ? "text-gray-500 dark:text-gray-300"
                          : "text-gray-300 dark:text-gray-400"
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
                        sortBy === "name" && !sortAsc
                          ? "text-gray-500 dark:text-gray-300"
                          : "text-gray-300 dark:text-gray-400"
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
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                <div
                  className="flex cursor-pointer items-center justify-between gap-3"
                  onClick={() => handleSort("email")}
                >
                  <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                    Email
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sortBy === "email" && sortAsc
                          ? "text-gray-500 dark:text-gray-300"
                          : "text-gray-300 dark:text-gray-400"
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
                        sortBy === "email" && !sortAsc
                          ? "text-gray-500 dark:text-gray-300"
                          : "text-gray-300 dark:text-gray-400"
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
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Телефон
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Роль
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                      <span className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          value={user.id}
                          checked={selected.includes(user.id)}
                          onChange={() => handleToggleOne(user.id)}
                        />
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                            selected.includes(user.id)
                              ? "border-brand-500 bg-brand-500"
                              : "bg-transparent border-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <span
                            className={
                              selected.includes(user.id) ? "" : "opacity-0"
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
                      {user.id}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.full_name || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {user.email}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {user.phone || "—"}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`${getRoleBadgeClass(user.role)} text-theme-xs rounded-full px-2 py-0.5 font-medium`}
                  >
                    {user.role || "User"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className=" flex items-center justify-center">
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
            <span className="text-gray-800 dark:text-white/90">
              {(currentPage - 1) * perPage + 1}
            </span>{" "}
            to
            <span className="text-gray-800 dark:text-white/90">
              {Math.min(currentPage * perPage, sortedUsers.length)}
            </span>{" "}
            of{" "}
            <span className="text-gray-800 dark:text-white/90">
              {sortedUsers.length}
            </span>
          </span>
        </div>
        {/*<div className="flex items-center dark:bg-white/[0.03] sm:bg-transparent dark:sm:bg-transparent justify-between gap-2 bg-gray-50 p-4 rounded-lg w-full sm:w-auto sm:justify-normal">*/}
        {/*  <button*/}
        {/*    onClick={handlePrevPage}*/}
        {/*    disabled={currentPage === 1}*/}
        {/*    className="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"*/}
        {/*  >*/}
        {/*    <span>*/}
        {/*      <svg*/}
        {/*        className="fill-current"*/}
        {/*        width="20"*/}
        {/*        height="20"*/}
        {/*        viewBox="0 0 20 20"*/}
        {/*        fill="none"*/}
        {/*        xmlns="http://www.w3.org/2000/svg"*/}
        {/*      >*/}
        {/*        <path*/}
        {/*          fillRule="evenodd"*/}
        {/*          clipRule="evenodd"*/}
        {/*          d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"*/}
        {/*        />*/}
        {/*      </svg>*/}
        {/*    </span>*/}
        {/*  </button>*/}
        {/*  <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">*/}
        {/*    Page {currentPage} of {totalPages}*/}
        {/*  </span>*/}
        {/*  <ul className="hidden items-center gap-0.5 sm:flex">*/}
        {/*    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (*/}
        {/*      <li key={page}>*/}
        {/*        <a*/}
        {/*          href="#"*/}
        {/*          onClick={(e) => {*/}
        {/*            e.preventDefault();*/}
        {/*            handleGoToPage(page);*/}
        {/*          }}*/}
        {/*          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${*/}
        {/*            currentPage === page*/}
        {/*              ? "bg-brand-500 hover:bg-brand-500 text-white hover:text-white"*/}
        {/*              : "text-gray-700 hover:bg-brand-500 hover:text-white dark:text-gray-400 dark:hover:text-white"*/}
        {/*          }`}*/}
        {/*        >*/}
        {/*          {page}*/}
        {/*        </a>*/}
        {/*      </li>*/}
        {/*    ))}*/}
        {/*  </ul>*/}
        {/*  <button*/}
        {/*    onClick={handleNextPage}*/}
        {/*    disabled={currentPage === totalPages}*/}
        {/*    className="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"*/}
        {/*  >*/}
        {/*    <span>*/}
        {/*      <svg*/}
        {/*        className="fill-current"*/}
        {/*        width="20"*/}
        {/*        height="20"*/}
        {/*        viewBox="0 0 20 20"*/}
        {/*        fill="none"*/}
        {/*        xmlns="http://www.w3.org/2000/svg"*/}
        {/*      >*/}
        {/*        <path*/}
        {/*          fillRule="evenodd"*/}
        {/*          clipRule="evenodd"*/}
        {/*          d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"*/}
        {/*        />*/}
        {/*      </svg>*/}
        {/*    </span>*/}
        {/*  </button>*/}
        {/*</div>*/}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleGoToPage}
        />
      </div>
    </div>
  );
};

export default UserList;
