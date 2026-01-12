import SvgIcon from "./SvgIcon";
import type { PaginationMeta } from "../types/api/pagination";

const MAX_VISIBLE_PAGES = 20;
const SHOW_MOBILE_INFO = true;

interface PaginationProps {
  pages: PaginationMeta;
  onChange: (page: number) => void;
  maxVisible?: number;
  showMobileInfo?: boolean;
}

export default function Pages({
  pages,
  onChange,
  maxVisible = MAX_VISIBLE_PAGES,
  showMobileInfo = SHOW_MOBILE_INFO,
}: PaginationProps){
  if (pages.count === 0) return null;

  const lastPages = pages.last;
  const page = pages.page;

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(lastPages, page + half);

  if (end - start + 1 < maxVisible) {
    if (start === 1) {
      end = Math.min(lastPages, start + maxVisible - 1);
    } else if (end === lastPages) {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  const pageItems: (number | "...")[] = [];

  if (start > 1) {
    pageItems.push(1);
    if (start > 2) pageItems.push("...");
  }

  for (let i = start; i <= end; i++) {
    pageItems.push(i);
  }

  if (end < lastPages) {
    if (end < lastPages - 1) pageItems.push("...");
    pageItems.push(lastPages);
  }

  return (
    <>
      <div className="pb-3 sm:pb-0">
        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="text-gray-800 dark:text-white/90">
            {pages.from}
          </span>{" "}
          to
          <span className="text-gray-800 dark:text-white/90">
            {page > 1 ? pages.limit + pages.in : pages.in}
          </span>{" "}
          of{" "}
          <span className="text-gray-800 dark:text-white/90">
            {pages.count}
          </span>
        </span>
      </div>
      {lastPages > 1 && (
        <div className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:rounded-none sm:bg-transparent sm:p-0 dark:bg-gray-900 dark:sm:bg-transparent">
          {/* Previous Button */}
          <button
            onClick={() => onChange(page - 1)}
            disabled={page === 1}
            className="shadow-sm flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
            aria-label="Previous page"
          >
            <SvgIcon name="left-arrow" />
          </button>

          {/* Mobile Page Info */}
          {showMobileInfo && (
            <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
              Page <span>{page}</span> of <span>{lastPages}</span>
            </span>
          )}

          {/* Page Numbers */}
          <ul className="hidden items-center gap-0.5 sm:flex">
            {pageItems.map((pageNum, index) => (
              <li key={`${pageNum}-${index}`}>
                {pageNum === "..." ? (
                  <span className="flex h-10 w-10 items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {pageNum}
                  </span>
                ) : (
                  <button
                    onClick={() => onChange(pageNum as number)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-brand-500 text-white"
                        : "text-gray-700 dark:text-gray-400 hover:bg-brand-500 hover:text-white dark:hover:text-white"
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={page === pageNum ? "page" : undefined}
                  >
                    <span>{pageNum}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Next Button */}
          <button
            onClick={() => onChange(page + 1)}
            disabled={page === lastPages}
            className="shadow-sm flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
            aria-label="Next page"
          >
            <SvgIcon name="right-arrow" />
          </button>
        </div>
        )}
    </>
  );
};
