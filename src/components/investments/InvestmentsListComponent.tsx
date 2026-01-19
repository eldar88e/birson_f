import { useEffect, useState } from "react";
import { investmentService } from "../../api/investment";
import Pages from "../../shared/ui/Pages";
import SvgIcon from "../../shared/ui/SvgIcon";
import type { Investment } from "../../entities/investment/model";
import type { PaginationMeta } from "../../shared/types/api/pagination";
import { DeleteAction } from "../../shared/ui/DeleteAction";
//import InvestmentModal from "./InvestmentModal";
import Loader from "../../shared/ui/Loader";
// import { useTranslation } from "react-i18next";
import { formatDate } from "../../shared/lib/formatDate";

interface Investments {
  data: Investment[];
  meta: PaginationMeta;
}

export default function InvestmentsListComponent() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [pages, setPages] = useState<Investments["meta"]>({
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
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        let params = `?page=${page}`
        if (searchQuery) params += `&q[comment_cont]=${searchQuery}`
        const response = await investmentService.getInvestments(params);
        setInvestments(response.data);
        setPages(response.meta);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load investments";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [page, searchQuery]);

  if (isLoading) {
    return (
      <Loader text="Загрузка инвестиций..." />
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
        Ошибка: {error}
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 dark:text-gray-400">
        Инвестиции не найдены
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Инвестиции
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Список инвестиций
          </p>
        </div>
        <div className="flex gap-3.5">
          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <SvgIcon name="search" />
              </span>
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
          </div>
        </div>
      </div>
      { isLoading && <Loader text="Загрузка инвестиций..." />}
      { error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          Ошибка: {error}
        </div>
      )}
      {investments.length === 0 && (
        <div className="text-center text-gray-500 py-8 dark:text-gray-400">
          Инвестиции не найдены
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Комментарий
              </th>
              <th scope="col" className="px-6 py-3">
                Сумма
              </th>
              <th scope="col" className="px-6 py-3">
                Дата инвестиции
              </th>
              <th scope="col" className="px-6 py-3">
                Дата создания
              </th>
              <th scope="col" className="px-6 py-3">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {investments.map((investment) => (
              <tr key={investment.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 whitespace-nowrap">
                  {investment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {investment.comment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {investment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(investment.invested_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(investment.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingInvestment(investment);
                        setIsModalOpen(true);
                      }}
                      className="text-xs flex rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      Редактировать
                    </button>
                    <DeleteAction
                      id={investment.id}
                      itemName={`Инвестиция #${investment.id}`}
                      onDelete={(id) => investmentService.deleteInvestment(id)}
                      onSuccess={() =>
                        setInvestments((prev) => prev.filter((c) => c.id !== investment.id))
                      }
                    >
                      {(open) => (
                        <button
                          onClick={open}
                          className="text-xs flex rounded-lg px-3 py-2 font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-900"
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
