export default function WhiteAndDarkTooltip() {
  return (
    <div className="flex items-center gap-10">
      {/* <!-- White --> */}
      <div className="relative inline-block group">
        <button className="inline-flex px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs">
          White Tooltip
        </button>
        <div className="invisible absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
          <div className="relative">
            <div className="px-3 py-2 text-xs font-medium text-gray-700 bg-white rounded-lg drop-shadow-4xl whitespace-nowrap">
              This is a tooltip
            </div>
            <div className="absolute w-4 h-3 rotate-45 -translate-x-1/2 bg-white drop-shadow-4xl -bottom-1 left-1/2"></div>
          </div>
        </div>
      </div>
      {/* <!-- Dark --> */}
      <div className="relative inline-block group">
        <button className="inline-flex px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs">
          Dark Tooltip
        </button>
        <div className="invisible absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
          <div className="relative">
            <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-[#1E2634] px-3 py-2 text-xs font-medium text-white">
              This is a tooltip
            </div>
            <div className="absolute -bottom-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-[#1E2634]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
