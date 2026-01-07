import { authService } from "../../api/auth";
import type { User } from "../../entities/user/model";
import {useState} from "react";
import AvatarText from "../../shared/ui/AvatarText.tsx";
import { useTranslation } from "react-i18next";

export default function UserWelcome() {
  const [user] = useState<User | null>(() => authService.getCurrentUser());
  const { t } = useTranslation();
  if (!user) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mb-6">
      <div className="flex items-center gap-4">
        <AvatarText name={user.full_name} size={16} classText="text-2xl" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            {t("hello")}, {user.first_name}!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email} • {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}

