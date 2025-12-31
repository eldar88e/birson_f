import iconsUrl from "@/images/icons.svg";

type IconProps = {
  name: string;
  width?: number;
  height?: number;
  className?: string;
  color?: string;
};

export default function SvgIcon({
  name,
  width = 20,
  height,
  className = "",
}: IconProps) {
  const size = height ?? width;

  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={width}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <use href={`${iconsUrl}#${name}`} />
    </svg>
  );
}
