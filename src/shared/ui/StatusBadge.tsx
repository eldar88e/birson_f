import type { Appointment } from "../../entities/appointments/model";
import type { OrderItem } from "../../api/orderItems";

type Status = Appointment["state"] | OrderItem["state"];

const STATUS_MAP: Record<string, string> = {
  completed: "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500",
  processing: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
  cancelled: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
  initial: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",
  diagnostic: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500",
  agreement: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-500",
  control: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-500",
};

const STATUS_LABELS: Record<string, string> = {
  initial: "В ожидании",
  diagnostic: "Диагностика",
  agreement: "Согласование",
  processing: "В процессе",
  control: "Контроль",
  completed: "Завершен",
  cancelled: "Отменен",
};

export function StatusBadge({ state }: { state: Status }) {
  return (
    <span
      className={`text-theme-xs rounded-full px-2 py-0.5 font-medium ${
        STATUS_MAP[state] || "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400"
      }`}>
      {STATUS_LABELS[state] || state}
    </span>
  );
}
