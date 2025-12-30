import ComponentCard from "../common/ComponentCard";
import { Link } from "react-router";

export default function LinkOpacityExample() {
  return (
    <ComponentCard title=" Link Opacity">
      <div className="flex flex-col space-y-3">
        <Link
          to="/"
          className="text-sm font-normal text-gray-500/10 dark:text-gray-400/10"
        >
          Link opacity 10
        </Link>
        <Link
          to="/"
          className="text-sm font-normal text-gray-500/25 dark:text-gray-400/25"
        >
          Link opacity 25
        </Link>
        <Link
          to="/"
          className="text-sm font-normal text-gray-500/50 dark:text-gray-400/50"
        >
          Link opacity 50
        </Link>
        <Link
          to="/"
          className="text-sm font-normal text-gray-500/75 dark:text-gray-400/75"
        >
          Link opacity 75
        </Link>
        <Link
          to="/"
          className="text-sm font-normal text-gray-500 dark:text-gray-400"
        >
          Link opacity 100
        </Link>
      </div>
    </ComponentCard>
  );
}
