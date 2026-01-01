import { authService } from "../../api/auth";
import type { User } from "../../entities/user/model";
import {useState} from "react";

export default function UserWelcome() {
  const [user] = useState<User | null>(() => authService.getCurrentUser());

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center">
          <span className="text-xl font-semibold text-white">
            {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Добро пожаловать, {user.full_name}!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email} • {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}

