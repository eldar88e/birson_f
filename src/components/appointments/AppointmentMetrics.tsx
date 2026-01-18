import { Link } from "react-router";
import { useEffect, useState } from "react";
import SvgIcon from "../../shared/ui/SvgIcon";
import { ROUTES } from "../../shared/config/routes.ts";
import { appointmentService } from "../../api/appointmet";
import Loader from "../../shared/ui/Loader";

interface Statistics {
  cars_waiting: number;
  cars_in_work: number;
  money_in_work: number;
  new_orders_week: number;
}

export default function AppointmentMetrics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await appointmentService.getStatistics();
        setStatistics(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load statistics";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white/90">
            Cтатистика заказов
          </h2>
        </div>
        <div>
          <Link
            to={ROUTES.APPOINTMENTS.ADD_APPOINTMENT}
            className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
          >
            <SvgIcon name="plus" />
            Добавить
          </Link>
        </div>
      </div>
      { isLoading ? (
        <Loader text="Загрузка статистики..." />
        ) : (
          error ? (
            <div className="p-5">
              <span className="h-32 hidden"></span>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {error}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
              <div className="border-b p-5 sm:border-r lg:border-b-0">
                <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
                  Машины в ожидании
                </p>
                <h3 className="text-3xl text-gray-800 dark:text-white/90">
                  {statistics?.cars_waiting ?? 0}
                </h3>
              </div>
              <div className="border-b p-5 lg:border-b-0">
                <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
                  Машины в работе
                </p>
                <h3 className="text-3xl text-gray-800 dark:text-white/90">
                  {statistics?.cars_in_work ?? 0}
                </h3>
              </div>
              <div className="border-b p-5 sm:border-r sm:border-b-0">
                <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
                  Новые заказы за неделю
                </p>
                <h3 className="text-3xl text-gray-800 dark:text-white/90">
                  {statistics?.new_orders_week ?? 0}
                </h3>
              </div>
              <div className="p-5">
                <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
                  Деньги в работе
                </p>
                <h3 className="text-3xl text-gray-800 dark:text-white/90">
                  {statistics?.money_in_work ? formatMoney(statistics.money_in_work) : formatMoney(0)}
                </h3>
              </div>
            </div>
          )
        )
      }
    </div>
  );
}
