import type { Appointment } from "../../entities/appointments/model";

const STATUS_MAP: Record<
  Appointment["state"],
  string
> = {
  completed: "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500",
  processing: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
  cancelled: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
  initial: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",
};

export function StatusBadge({ state }: { state: Appointment["state"] }) {
  return (
    <span className={`text-theme-xs rounded-full px-2 py-0.5 font-medium ${STATUS_MAP[state]}`}>
      {state}
    </span>
  );
}
