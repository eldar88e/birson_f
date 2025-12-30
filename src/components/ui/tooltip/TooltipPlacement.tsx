export default function TooltipPlacement() {
  return (
    <div className="flex flex-col items-center gap-10 sm:flex-row">
      {/* <!-- Top --> */}
      <div className="relative inline-block group">
        <button className="inline-flex px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs">
          Tooltip Top
        </button>
        <div className="invisible absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
          <div className="relative">
            <div className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 drop-shadow-4xl dark:bg-[#1E2634] dark:text-white">
              This is a tooltip
            </div>
            <div className="absolute -bottom-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-white dark:bg-[#1E2634]"></div>
          </div>
        </div>
      </div>

      {/* <!-- Right --> */}
      <div className="relative inline-block group">
        <button className="inline-flex px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs">
          Tooltip Right
        </button>
        <div className="invisible absolute left-full top-1/2 z-30 ml-2.5 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
          <div className="relative">
            <div className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 drop-shadow-4xl dark:bg-[#1E2634] dark:text-white">
              This is a tooltip
            </div>
            <div className="absolute -left-1.5 top-1/2 h-3 w-4 -translate-y-1/2 rotate-45 bg-white dark:bg-[#1E2634]"></div>
          </div>
        </div>
      </div>

      {/* <!-- Left --> */}
      <div className="relative inline-block group">
        <button className="inline-flex px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs">
          Tooltip Left
        </button>
        <div className="invisible absolute right-full top-1/2 mr-2.5 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
          <div className="relative">
            <div className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 drop-shadow-4xl dark:bg-[#1E2634] dark:text-white">
              This is a tooltip
            </div>
            <div className="absolute -right-1.5 top-1/2 h-3 w-4 -translate-y-1/2 rotate-45 bg-white dark:bg-[#1E2634]"></div>
          </div>
        </div>
      </div>

      {/* <!-- Bottom --> */}
      <div className="relative inline-block group">
        <button className="inline-flex px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs">
          Tooltip Bottom
        </button>
        <div className="invisible absolute left-1/2 top-full mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
          <div className="relative">
            <div className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 drop-shadow-4xl dark:bg-[#1E2634] dark:text-white">
              This is a tooltip
            </div>
            <div className="absolute -top-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-white dark:bg-[#1E2634]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
