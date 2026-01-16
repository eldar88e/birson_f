import { useEffect, useState } from "react";
import { serviceService } from "../../api/services";
import Pages from "../../shared/ui/Pages";
import SvgIcon from "../../shared/ui/SvgIcon";
import type { Service } from "../../entities/service/model";
import type { PaginationMeta } from "../../shared/types/api/pagination";
import { DeleteAction } from "../../shared/ui/DeleteAction";
import ServiceModal from "./ServiceModal";
import { useTranslation } from "react-i18next";
import Loader from "../../shared/ui/Loader";

interface Services {
  data: Service[];
  meta: PaginationMeta;
}

export default function ServiceListComponent() {
  const { t } = useTranslation("service");
  const [services, setServices] = useState<Service[]>([]);
  const [pages, setPages] = useState<Services["meta"]>({
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const response = await serviceService.getServices(`?page=${page}`);
        setServices(response.data);
        setPages(response.meta);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load services";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [page]);

  if (isLoading) {
    return (
      <Loader text="Загрузка услуг..." />
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
        Ошибка: {error}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 dark:text-gray-400">
        Услуги не найдены
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <button
          className="bg-brand-500 shadow-sm hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          onClick={() => setIsModalOpen(true)}
        >
          <SvgIcon name="plus" />
          {t("btn.add")}
        </button>
        <ServiceModal 
          isModalOpen={isModalOpen || editingService !== null} 
          service={editingService}
          onClose={() => {
            setIsModalOpen(false);
            setEditingService(null);
          }}
          onSuccess={(service) => {
            if (editingService) {
              setServices((prev) => 
                prev.map((s) => s.id === service.id ? service : s)
              );
              setEditingService(null);
            } else {
              setServices((prev) => [...prev, service]);
              setIsModalOpen(false);
            }
          }}
        />
        <div className="flex gap-3.5">
          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <SvgIcon name="search" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value=""
                // onChange={(e) => setSearchQuery(e.target.value)}
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
                Название
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Дата создания
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {services.map((service) => (
              <tr
                key={service.id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                    {service.id}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                    {service.title}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {service.created_at}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEditingService(service)}
                      className="text-xs flex rounded-lg px-3 py-2 font-medium text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/20"
                    >
                      Редактировать
                    </button>
                    <DeleteAction
                      id={service.id}
                      itemName={`Услуга #${service.id}`}
                      onDelete={(id) => serviceService.deleteService(id)}
                      onSuccess={() =>
                        setServices((prev) => prev.filter((c) => c.id !== service.id))
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
