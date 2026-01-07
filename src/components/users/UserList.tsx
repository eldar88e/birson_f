import { useEffect, useState } from "react";
import TableDropdown from "../common/TableDropdown";
import { apiClient } from "../../api/client";
import Pages from "../../shared/ui/Pages";
import SvgIcon from "../../shared/ui/SvgIcon";
import { Link } from "react-router";
import { ROUTES } from "../../shared/config/routes";
import type { User } from "../../entities/user/model";
import { USER_FILTERS } from "../../entities/user/model";
import AvatarText from "../../shared/ui/AvatarText";
import { FilterTabs } from "../../shared/ui/FilterTabs";
import Loader from "../../shared/ui/Loader";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";
import { ConfirmDeleteModal } from "../../shared/ui/ConfirmDeleteModal";

interface Users {
  data: User[];
  meta: {
    page: number;
    count: number;
    limit: number;
    from: number;
    in: number;
    last: number;
  };
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [pages, setPages] = useState<Users["meta"]>({
    page: 1,
    count: 0,
    limit: 0,
    from: 0,
    in: 0,
    last: 0,
  });
  const [page, setPage] = useState(pages.page);
  const [filter, setFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        let path = `${ROUTES.USERS.INDEX}?page=${page}`
        if (filter) path += `&q[role_eq]=${filter}`
        if (searchQuery) path += `&q[full_name_or_phone_cont_any]=${searchQuery}`
        const data = await apiClient.get<Users>(path, true);
        setUsers(data.data);
        setPages(data.meta);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load users";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, filter, searchQuery]);

  const getRoleBadgeClass = (role?: string): string => {
    const roleMap: Record<string, string> = {
      admin: "bg-error-50 dark:bg-error-500/15 text-error-700 dark:text-error-500",
      manager: "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-500",
      staff: "bg-warning-50 dark:bg-warning-500/15 text-warning-600 dark:text-warning-500",
      user: "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500",
    };
    return roleMap[role?.toLowerCase() || "user"] || roleMap.user;
  };

  const deleteModal = useConfirmDelete({
    onDelete: () =>
      apiClient.delete(`/users/${userToDelete}`, true),
    onSuccess: () =>
      setUsers((prev) =>
        prev.filter((a) => a.id !== userToDelete)
      ),
    successMessage: "Пользователь удален",
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <Link
          to={ROUTES.USERS.ADD_USER}
          className="bg-brand-500 shadow-sm hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          <SvgIcon name="plus" />
          Добавить
        </Link>
        <div className="flex gap-3.5">
          <div className="hidden h-11 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 lg:inline-flex dark:bg-gray-900">
            <FilterTabs value={filter} onChange={setFilter} options={USER_FILTERS} />
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

      {isLoading && <Loader text="Загрузка пользователей..." />}

      { error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          Ошибка: {error}
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center text-gray-500 py-8 dark:text-gray-400">
          Пользователи не найдены
        </div>
      )}

      {users.length > 0 && !isLoading && !error && (
        <>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                  ID
                </th>
                  <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                    <div
                      className="flex cursor-pointer items-center justify-between gap-3"
                      // onClick={() => handleSort("full_name")}
                    >
                      <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                        ФИО
                      </p>
                      <span className="flex flex-col gap-0.5">
                        <svg
                          // className={
                          //   sortBy === "full_name" && sortAsc
                          //     ? "text-gray-500 dark:text-gray-300"
                          //     : "text-gray-300 dark:text-gray-400"
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
                          //   sortBy === "full_name" && !sortAsc
                          //     ? "text-gray-500 dark:text-gray-300"
                          //     : "text-gray-300 dark:text-gray-400"
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
                  <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                    <div
                      className="flex cursor-pointer items-center justify-between gap-3"
                      // onClick={() => handleSort("email")}
                    >
                      <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                        Email
                      </p>
                      <span className="flex flex-col gap-0.5">
                        <svg
                          // className={
                          //   sortBy === "email" && sortAsc
                          //     ? "text-gray-500 dark:text-gray-300"
                          //     : "text-gray-300 dark:text-gray-400"
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
                          //   sortBy === "email" && !sortAsc
                          //     ? "text-gray-500 dark:text-gray-300"
                          //     : "text-gray-300 dark:text-gray-400"
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                        {user.id}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                        <AvatarText name={user.full_name} size={8} classText="text-xs" />
                        <div>{user.full_name || "—"}</div>
                      </div>
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
                        {user.role}
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
                              <Link
                                to={`/users/${user.id}`}
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              >
                                Подробнее
                              </Link>
                              <button 
                                onClick={() => {
                                  setUserToDelete(user.id);
                                  deleteModal.open();
                                  }}
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              >
                                Удалить
                              </button>
                            </>
                          }
                        />
                        <ConfirmDeleteModal
                          isOpen={deleteModal.isOpen}
                          isLoading={deleteModal.isLoading}
                          onClose={deleteModal.close}
                          onConfirm={deleteModal.confirm}
                          itemName={`Пользователь #${userToDelete}`}
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
                  {pages.from}
                </span>{" "}
                to
                <span className="text-gray-800 dark:text-white/90">
                  {pages.in}
                </span>{" "}
                of{" "}
                <span className="text-gray-800 dark:text-white/90">
                  {pages.count}
                </span>
              </span>
            </div>
            <Pages
              page={page}
              lastPages={pages.last}
              onChange={setPage}
              maxVisible={pages.limit}
            />
          </div>
        </>
      )}
    </div>
  )
};
