import { Link as RouterLink } from "react-router";

interface LinkProps {
  to: string; // Use 'to' for React Router navigation
  text: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "gray"
    | "blue-light";
  underline?: boolean;
  opacity?: 10 | 25 | 50 | 75 | 100;
  hoverEffect?: boolean;
}

const Link: React.FC<LinkProps> = ({
  to,
  text,
  variant = "gray",
  underline = false,
  opacity,
  hoverEffect = false,
}) => {
  // Base styles
  const baseStyles = "text-sm font-normal transition-colors";

  // Variant colors
  const variants: Record<string, string> = {
    primary: "text-gray-500 dark:text-gray-400",
    secondary: "text-brand-500 dark:text-brand-500",
    success: "text-success-500",
    danger: "text-error-500",
    warning: "text-warning-500",
    "blue-light": "text-blue-light-500",
    gray: "text-gray-500 dark:text-gray-400",
  };

  // Opacity handling
  const opacityClass = opacity
    ? `text-gray-500/${opacity} dark:text-gray-400/${opacity}`
    : "";

  // Hover effects
  const hoverClass = hoverEffect
    ? `hover:text-gray-500/${opacity || 100} dark:hover:text-gray-400/${
        opacity || 100
      }`
    : "";

  // Underline handling
  const underlineClass = underline ? "underline" : "";

  return (
    <RouterLink
      to={to}
      className={`${baseStyles} ${variants[variant]} ${opacityClass} ${hoverClass} ${underlineClass}`}
    >
      {text}
    </RouterLink>
  );
};

export default Link;
