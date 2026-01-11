import { useEffect, useState } from "react";
import { carService } from "../../api/cars";
import Pages from "../../shared/ui/Pages";
import SvgIcon from "../../shared/ui/SvgIcon";
import { Link } from "react-router";
import { ROUTES } from "../../shared/config/routes";
import type { Car } from "../../entities/car/model";
import type { PaginationMeta } from "../../shared/types/api/pagination";
import CarModal from "./CarModal";
import { DeleteAction } from "../../shared/ui/DeleteAction";

interface Cars {
  data: Car[];
  meta: PaginationMeta;
}

export default function CarListComponent() {
  const [cars, setCars] = useState<Car[]>([]);
  const [pages, setPages] = useState<Cars["meta"]>({
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

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const data = await carService.getCars(`?page=${page}`);
        setCars(data.data);
        setPages(data.meta);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load cars";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Загрузка автомобилей...</div>
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

  if (cars.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 dark:text-gray-400">
        Автомобили не найдены
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
          Добавить
        </button>
        <CarModal 
          isModalOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          ownerId={0}
          onSuccess={(car) => {
            setCars((prev) => [...prev, car]);
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
                Модель
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Марка
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Год
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Владелец
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Цвет
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Номер
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                VIN
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Комментарий
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {cars.map((car) => (
              <tr
                key={car.id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                    {car.id}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                    {car.model}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {car.brand}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {car.year}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    <Link to={`${ROUTES.USERS.INDEX}/${car.owner_id}`} className="text-blue-500 hover:text-blue-600">
                      Клиент ID: #{car.owner_id}
                    </Link>
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    —
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {car.license_plate}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {car.vin}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {car.comment}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className=" flex items-center justify-center">
                  <DeleteAction
                    id={car.id}
                    itemName={`Автомобиль #${car.id}`}
                    onDelete={(id) => carService.deleteCar(id)}
                    onSuccess={() =>
                      setCars((prev) => prev.filter((c) => c.id !== car.id))
                    }
                  >
                    {(open) => (
                      <button
                        onClick={open}
                        className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
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
};
