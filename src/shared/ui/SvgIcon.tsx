import iconsUrl from "@/images/icons.svg";

const DEFAULT_ICON_SIZE = 20;

type IconProps = {
  name: string;
  width?: number;
  height?: number;
  className?: string;
  color?: string;
};

export default function SvgIcon({
  name,
  width = DEFAULT_ICON_SIZE,
  height,
  className = "",
}: IconProps) {
  const normalizedHeight = height ?? width ?? DEFAULT_ICON_SIZE;

  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={width}
      height={normalizedHeight}
      fill="currentColor"
      aria-hidden="true"
    >
      <use href={`${iconsUrl}#${name}`} />
    </svg>
  );
}
