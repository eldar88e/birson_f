import React, { useEffect, useMemo, useState } from "react";
import TableDropdown from "../common/TableDropdown";
import { apiClient } from "../../api/client";
import Pagination from "../../shared/ui/Pages";
import SvgIcon from "../../shared/ui/SvgIcon";

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
                <SvgIcon name="search" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
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
                            <SvgIcon name="check" />
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
                            <SvgIcon name="check" />
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
                          <SvgIcon name="more-horizontal" />
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
