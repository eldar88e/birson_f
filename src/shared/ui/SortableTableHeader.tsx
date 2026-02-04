import { SortIcon } from "./SortIcon";

interface SortableTableHeaderProps {
  label: string;
  field: string;
  currentSortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
}

export function SortableTableHeader({
  label,
  field,
  currentSortField,
  sortDirection,
  onSort,
  className = "",
}: SortableTableHeaderProps) {
  const isActive = currentSortField === field;

  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer ${className}`}
      onClick={() => onSort(field)}
    >
      <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
        {label}
      </p>
      <SortIcon isActive={isActive} direction={sortDirection} />
    </div>
  );
}
