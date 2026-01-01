import { createContext, useContext, useRef, useState } from "react";
import Notification from "../components/ui/notification/Notfication";

type NotificationType = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
};

const NotificationContext = createContext<{
  showNotification: (notification: NotificationType) => void;
}>({
  showNotification: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const showNotification = (notif: NotificationType) => {
    setNotification(notif);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const closeNotification = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <div className="fixed top-4 right-4 bg-white dark:bg-gray-900" style={{ zIndex: 99999 }}>
          <Notification
            {...notification}
            onClose={closeNotification}
          />
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
