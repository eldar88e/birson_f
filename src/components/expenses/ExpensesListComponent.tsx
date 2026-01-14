import { useEffect, useState } from "react";
import { expenseService } from "../../api/expenses";
import Pages from "../../shared/ui/Pages";
import SvgIcon from "../../shared/ui/SvgIcon";
import type { Expense } from "../../entities/expenses/model";
import type { PaginationMeta } from "../../shared/types/api/pagination";
import { DeleteAction } from "../../shared/ui/DeleteAction";
import ExpenseModal from "./ExpenseModal";
import Loader from "../../shared/ui/Loader";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../shared/lib/formatDate";

interface Expenses {
  data: Expense[];
  meta: PaginationMeta;
}

export default function ExpensesListComponent() {
  const { t } = useTranslation("expense");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pages, setPages] = useState<Expenses["meta"]>({
    page: 1,
    count: 0,
    limit: 0,
    from: 0,
    in: 0,
    last: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(pages.page);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        let params = `?page=${page}`
        if (searchQuery) params += `&q[description_cont]=${searchQuery}`
        const response = await expenseService.getExpenses(params);
        setExpenses(response.data);
        setPages(response.meta);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load expenses";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [page, searchQuery]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <button
          className="bg-brand-500 shadow-sm hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          onClick={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
        >
          <SvgIcon name="plus" />
          Добавить
        </button>
        <ExpenseModal
          isModalOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
          expense={editingExpense}
          onSuccess={(expense) => {
            if (editingExpense) {
              setExpenses((prev) =>
                prev.map((e) => (e.id === expense.id ? expense : e))
              );
            } else {
              setExpenses((prev) => [expense, ...prev]);
            }
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
        />
        <div className="flex gap-3.5">
          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <SvgIcon name="search" />
              </span>
              <input
                type="search"
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
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Категория
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Сумма
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Описание
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Дата расхода
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Дата создания
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Действия
              </th>
            </tr>
          </thead>

          {isLoading || expenses.length === 0 || error ? (
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                  {isLoading ? (<Loader text="Загрузка расходов..." />)
                  : expenses.length === 0 ? "Расходы не найдены" : (error && `Ошибка: ${error}`)
                  }
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                      {expense.id}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                      {t(`categories.${expense.category}`)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                      {expense.amount}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {expense.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {formatDate(expense.spent_at)}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                      {formatDate(expense.created_at)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingExpense(expense);
                          setIsModalOpen(true);
                        }}
                        className="text-xs flex rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        Редактировать
                      </button>
                      <DeleteAction
                        id={expense.id}
                        itemName={`Расход #${expense.id}`}
                        onDelete={(id) => expenseService.deleteExpense(id)}
                        onSuccess={() =>
                          setExpenses((prev) => prev.filter((c) => c.id !== expense.id))
                        }
                      >
                        {(open) => (
                          <button
                            onClick={open}
                            className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          >
                            Удалить
                          </button>
                        )}
                      </DeleteAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            )}
        </table>
      </div>
      <div className="flex items-center flex-col sm:flex-row justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
        <Pages
          pages={pages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
