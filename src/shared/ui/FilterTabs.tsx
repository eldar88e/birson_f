interface FilterTabsProps {
  value: string;
  onChange: (value: string) => void;
  onPageChange: (page: number) => void;
  options: readonly {
    value: string;
    label: string;
  }[];
}

export function FilterTabs({
  value,
  onChange,
  onPageChange,
  options,
}: FilterTabsProps) {
  return (
    <div className="hidden h-11 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 lg:inline-flex dark:bg-gray-900">
      {options.map(option => {
        return (
          <button
            key={option.value}
            onClick={() => {
              onChange(option.value);
              onPageChange(1);
            }}
            className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
              value === option.value
                ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
