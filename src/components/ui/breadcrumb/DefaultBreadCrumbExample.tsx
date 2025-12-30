import ComponentCard from "../../common/ComponentCard";
import { Link } from "react-router";

export default function DefaultBreadCrumbExample() {
  return (
    <ComponentCard title="Default Breadcrumb">
      <div className="space-y-5">
        {/* <!--  Breadcrumb item--> */}
        <div>
          <nav>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90">
                <span> / </span>
                <span> Ui Kits </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* <!--  Breadcrumb item--> */}
        <div>
          <nav>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                  to="#"
                >
                  <span> / </span>
                  <span> Ui Kits </span>
                </Link>
              </li>
              <li className="flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90">
                <span className="text-gray-500 dark:text-gray-400"> / </span>
                <span> Avatar </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </ComponentCard>
  );
}
