import Popover from "./Popover";
import Button from "../button/Button";
import { Link } from "react-router";

export default function PopoverWithLink() {
  return (
    <div className="max-w-full overflow-auto custom-scrollbar sm:overflow-visible">
      <div className="min-w-[750px]">
        <div className="flex flex-col flex-wrap items-center gap-4 sm:flex-row sm:gap-5">
          <div>
            <Popover
              position="top"
              trigger={<Button size="sm"> Popover on Top</Button>}
            >
              <div className="relative rounded-t-xl border-b border-gray-200 bg-gray-100 px-5 py-3 dark:border-white/[0.03] dark:bg-[#252D3A]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Top Popover
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris
                  facilisis congue exclamate justo nec facilisis.
                </p>
                <Link
                  to="/"
                  className="flex items-center gap-1 mt-5 text-sm font-medium text-brand-500 hover:text-brand-600"
                >
                  Learn More
                  <svg
                    className="fill-current"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.0855 7.99888C14.0858 8.19107 14.0126 8.38334 13.8661 8.53001L9.86873 12.5301C9.57594 12.8231 9.10107 12.8233 8.80807 12.5305C8.51508 12.2377 8.51491 11.7629 8.8077 11.4699L11.5279 8.74772L2.66797 8.74772C2.25375 8.74772 1.91797 8.41194 1.91797 7.99772C1.91797 7.58351 2.25375 7.24772 2.66797 7.24772L11.5235 7.24772L8.80772 4.53016C8.51492 4.23718 8.51507 3.7623 8.80805 3.4695C9.10104 3.1767 9.57591 3.17685 9.86871 3.46984L13.8311 7.43478C13.9871 7.57222 14.0855 7.77348 14.0855 7.99772C14.0855 7.99811 14.0855 7.9985 14.0855 7.99888Z"
                      fill=""
                    />
                  </svg>
                </Link>
              </div>
            </Popover>
          </div>
          <div>
            <Popover
              position="bottom"
              trigger={<Button size="sm"> Popover on Bottom</Button>}
            >
              <div className="rounded-t-xl border-b relative  border-gray-200  bg-gray-200 px-5 py-3 dark:border-white/[0.03] dark:bg-[#252D3A]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Top Popover
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris
                  facilisis congue exclamate justo nec facilisis.
                </p>
                <Link
                  to="/"
                  className="flex items-center gap-1 mt-5 text-sm font-medium text-brand-500 hover:text-brand-600"
                >
                  Learn More
                  <svg
                    className="fill-current"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.0855 7.99888C14.0858 8.19107 14.0126 8.38334 13.8661 8.53001L9.86873 12.5301C9.57594 12.8231 9.10107 12.8233 8.80807 12.5305C8.51508 12.2377 8.51491 11.7629 8.8077 11.4699L11.5279 8.74772L2.66797 8.74772C2.25375 8.74772 1.91797 8.41194 1.91797 7.99772C1.91797 7.58351 2.25375 7.24772 2.66797 7.24772L11.5235 7.24772L8.80772 4.53016C8.51492 4.23718 8.51507 3.7623 8.80805 3.4695C9.10104 3.1767 9.57591 3.17685 9.86871 3.46984L13.8311 7.43478C13.9871 7.57222 14.0855 7.77348 14.0855 7.99772C14.0855 7.99811 14.0855 7.9985 14.0855 7.99888Z"
                      fill=""
                    />
                  </svg>
                </Link>
              </div>
            </Popover>
          </div>
          <div>
            <Popover
              position="right"
              trigger={<Button size="sm"> Popover on Bottom</Button>}
            >
              <div className="rounded-t-xl border-b relative  border-gray-200  bg-gray-200 px-5 py-3 dark:border-white/[0.03] dark:bg-[#252D3A]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Top Popover
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris
                  facilisis congue exclamate justo nec facilisis.
                </p>
                <Link
                  to="/"
                  className="flex items-center gap-1 mt-5 text-sm font-medium text-brand-500 hover:text-brand-600"
                >
                  Learn More
                  <svg
                    className="fill-current"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.0855 7.99888C14.0858 8.19107 14.0126 8.38334 13.8661 8.53001L9.86873 12.5301C9.57594 12.8231 9.10107 12.8233 8.80807 12.5305C8.51508 12.2377 8.51491 11.7629 8.8077 11.4699L11.5279 8.74772L2.66797 8.74772C2.25375 8.74772 1.91797 8.41194 1.91797 7.99772C1.91797 7.58351 2.25375 7.24772 2.66797 7.24772L11.5235 7.24772L8.80772 4.53016C8.51492 4.23718 8.51507 3.7623 8.80805 3.4695C9.10104 3.1767 9.57591 3.17685 9.86871 3.46984L13.8311 7.43478C13.9871 7.57222 14.0855 7.77348 14.0855 7.99772C14.0855 7.99811 14.0855 7.9985 14.0855 7.99888Z"
                      fill=""
                    />
                  </svg>
                </Link>
              </div>
            </Popover>
          </div>
          <div>
            <Popover
              position="left"
              trigger={<Button size="sm"> Popover on Bottom</Button>}
            >
              <div className="rounded-t-xl border-b relative  border-gray-200  bg-gray-200 px-5 py-3 dark:border-white/[0.03] dark:bg-[#252D3A]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Top Popover
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris
                  facilisis congue exclamate justo nec facilisis.
                </p>
                <Link
                  to="/"
                  className="flex items-center gap-1 mt-5 text-sm font-medium text-brand-500 hover:text-brand-600"
                >
                  Learn More
                  <svg
                    className="fill-current"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.0855 7.99888C14.0858 8.19107 14.0126 8.38334 13.8661 8.53001L9.86873 12.5301C9.57594 12.8231 9.10107 12.8233 8.80807 12.5305C8.51508 12.2377 8.51491 11.7629 8.8077 11.4699L11.5279 8.74772L2.66797 8.74772C2.25375 8.74772 1.91797 8.41194 1.91797 7.99772C1.91797 7.58351 2.25375 7.24772 2.66797 7.24772L11.5235 7.24772L8.80772 4.53016C8.51492 4.23718 8.51507 3.7623 8.80805 3.4695C9.10104 3.1767 9.57591 3.17685 9.86871 3.46984L13.8311 7.43478C13.9871 7.57222 14.0855 7.77348 14.0855 7.99772C14.0855 7.99811 14.0855 7.9985 14.0855 7.99888Z"
                      fill=""
                    />
                  </svg>
                </Link>
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
