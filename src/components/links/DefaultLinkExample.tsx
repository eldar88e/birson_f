import ComponentCard from "../common/ComponentCard";
import { Link } from "react-router";

export default function DefaultLinkExample() {
  return (
    <ComponentCard title="Colored Links">
      <div className="flex flex-col space-y-3">
        <Link
          to="/"
          className="text-sm font-normal text-gray-500 dark:text-gray-400"
        >
          Primary link
        </Link>
        <Link
          to="/"
          className="text-sm font-normal text-brand-500 dark:text-brand-500"
        >
          Secondary link
        </Link>
        <Link to="/" className="text-sm font-normal text-success-500">
          Success link
        </Link>
        <Link to="/" className="text-sm font-normal text-error-500">
          Danger link
        </Link>
        <Link to="/" className="text-sm font-normal text-warning-500">
          Warning link
        </Link>
        <Link to="/" className="text-sm font-normal text-blue-light-500">
          Primary link
        </Link>
        <Link to="/" className="text-sm font-normal text-gray-400">
          Primary link
        </Link>
        <Link
          to="/"
          className="text-sm font-normal text-gray-800 dark:text-white/90"
        >
          Primary link
        </Link>
      </div>
    </ComponentCard>
  );
}
