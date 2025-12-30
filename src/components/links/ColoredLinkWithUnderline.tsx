import ComponentCard from "../common/ComponentCard";
import { Link } from "react-router";

export default function ColoredLinkWithUnderline() {
  return (
    <ComponentCard title="Colored links with Underline">
      <div className="flex flex-col space-y-3">
        <Link
          to="/"
          className="text-sm font-normal text-gray-500 underline dark:text-gray-400"
        >
          Primary link
        </Link>
        <Link to="/" className="text-sm font-normal underline text-brand-500">
          Secondary link
        </Link>
        <Link to="/" className="text-sm font-normal underline text-success-500">
          Success link
        </Link>
        <Link to="/" className="text-sm font-normal underline text-error-500">
          Danger link
        </Link>
        <Link to="/" className="text-sm font-normal underline text-warning-500">
          Warning link
        </Link>
        <Link
          to="/"
          className="text-sm font-normal underline text-blue-light-500"
        >
          Primary link
        </Link>
        <Link to="/" className="text-sm font-normal text-gray-400 underline">
          Primary link
        </Link>
        <Link
          to="/"
          className="text-sm font-normal text-gray-800 underline dark:text-white/90"
        >
          Primary link
        </Link>
      </div>
    </ComponentCard>
  );
}
