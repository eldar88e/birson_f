import {
  AlertHexaIcon,
  CheckCircleIcon,
  CloseIcon,
  ErrorHexaIcon,
  InfoIcon,
} from "../../../icons";

interface NotificationProps {
  variant: "success" | "info" | "warning" | "error";
  title: string;
  description?: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
                                                     variant,
                                                     title,
                                                     description,
                                                     onClose,
                                                   }) => {
  const variantStyles = {
    success: {
      borderColor: "border-success-500",
      iconBg: "bg-success-50 text-success-500",
      icon: <CheckCircleIcon />,
    },
    info: {
      borderColor: "border-blue-light-500",
      iconBg: "bg-blue-light-50 text-blue-light-500",
      icon: <InfoIcon />,
    },
    warning: {
      borderColor: "border-warning-500",
      iconBg: "bg-warning-50 text-warning-500",
      icon: <AlertHexaIcon />,
    },
    error: {
      borderColor: "border-error-500",
      iconBg: "bg-error-50 text-error-500",
      icon: <ErrorHexaIcon className="size-5" />,
    },
  };

  const { borderColor, iconBg, icon } = variantStyles[variant];

  return (
    <div
      className={`flex items-center justify-between gap-3 w-full sm:max-w-[340px] rounded-md border-b-4 p-3 shadow-theme-sm dark:bg-[#1E2634] ${borderColor}`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconBg}`}>
          {icon}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
            {title}
          </h4>
          {description && (
            <p className="mt-1 text-xs text-gray-600 dark:text-white/70">
              {description}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-800 dark:hover:text-white/90"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

export default Notification;
