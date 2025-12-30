import ComponentCard from "../../common/ComponentCard";
import { Link } from "react-router";

export default function DottedDividerBreadcrumb() {
  return (
    <ComponentCard title="DottedDividerBreadcrumb">
      <div className="space-y-5">
        {/* <!--  Breadcrumb item--> */}
        <div>
          <nav>
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                  to="#"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-800 dark:text-white/90">
                <span className="block w-1 h-1 bg-gray-400 rounded-full"></span>
                <span> Ui Kits </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* <!--  Breadcrumb item--> */}
        <div>
          <nav>
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                  to="#"
                >
                  <span className="block w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span> Ui Kits </span>
                </Link>
              </li>

              <li className="flex items-center gap-2 text-sm text-gray-800 dark:text-white/90">
                <span className="block w-1 h-1 bg-gray-400 rounded-full"></span>
                <span> Button </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </ComponentCard>
  );
}
