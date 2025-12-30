export default function DefaultTooltip() {
  return (
    <div className="relative inline-block group">
      <button className="inline-flex px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs">
        Tooltip Top
      </button>
      <div className="invisible absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
        <div className="relative">
          <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 dark:bg-[#1E2634] dark:text-white">
            This is a tooltip
          </div>
          <div className="absolute -bottom-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-white dark:bg-[#1E2634]"></div>
        </div>
      </div>
    </div>
  );
}
