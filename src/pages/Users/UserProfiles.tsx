import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import UserMetaCard from "../../components/users/UserProfile/UserMetaCard.tsx";
import UserInfoCard from "../../components/users/UserProfile/UserInfoCard.tsx";
import UserAddressCard from "../../components/users/UserProfile/UserAddressCard.tsx";
import PageMeta from "../../components/common/PageMeta.tsx";
import { apiClient } from "../../api/client";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { User } from "../../entities/user/model";

export default function UserProfiles() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setIsLoading(true);
      setError("");
      try {
        const data = await apiClient.get<{ user: User }>(`/users/${userId}`, true);
        setUser(data.user);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load user";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/20">
        <p className="text-sm text-gray-600 dark:text-gray-400">Пользователь не найден</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${user.full_name} - Профиль | CRM`}
        description={`Профиль пользователя ${user.full_name}`}
      />
      <PageBreadcrumb pageTitle={`Профиль - ${user.full_name}`} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Профиль
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
          <UserAddressCard user={user} />
        </div>
      </div>
    </>
  );
}
