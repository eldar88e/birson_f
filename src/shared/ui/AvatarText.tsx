import clsx from "clsx";

interface AvatarProps {
  name?: string;
  size?: number;
  className?: string;
  classText?: string;
}

const DEFAULT_SIZE = 11;
const DEFAULT_CLASS_TEXT = "text-lg";

export default function AvatarText({name, size = DEFAULT_SIZE, className, classText = DEFAULT_CLASS_TEXT}: AvatarProps) {
  const words = name
    ? name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "--";

  return (
    <div
      className={clsx(
        "rounded-full bg-brand-500 flex items-center justify-center font-semibold text-white select-none",
        `w-${size} h-${size}`,
        className
        )
      }
    >
      <span className={clsx(
        classText,
        "font-semibold text-white"
        )
      }>
        {words}
      </span>
    </div>
  );
};
