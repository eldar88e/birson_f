import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Checkbox from "../../components/form/input/Checkbox";
import { apiClient } from "../../api/client";
import { useNotification } from "../../context/NotificationContext";
import { ROUTES } from "../../shared/config/routes";
import { User } from "../../entities/user/model";

export type CreateUserData = Omit<User, "id" | "created_at" | "full_name">;

export default function AddUser() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    additional_phone: "",
    role: "user",
    company_name: "",
    inn: "",
    kpp: "",
    ogrn: "",
    legal_address: "",
    actual_address: "",
    contact_person: "",
    contact_phone: "",
    bank_name: "",
    bik: "",
    checking_account: "",
    correspondent_account: "",
    source: "manual",
    comment: "",
    active: true,
  });

  const handleChange = (field: keyof CreateUserData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.phone) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Имя, Телефон",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post<{ user: { id: number } }>(
        ROUTES.USERS.INDEX,
        { user: formData },
        true
      );

      showNotification({
        variant: "success",
        title: "Пользователь создан!",
        description: "Новый пользователь успешно добавлен в систему",
      });

      setTimeout(() => {
        navigate(`${ROUTES.USERS.INDEX}/${response.user.id}`);
      }, 1000);
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка создания",
        description: error instanceof Error ? error.message : "Не удалось создать пользователя",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.USERS.INDEX);
  };

  return (
    <>
      <PageMeta
        title="Добавить пользователя | CRM"
        description="Создание нового пользователя"
      />
      <PageBreadcrumb pageTitle="Добавить пользователя" />
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Основная информация
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                formData.active
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {formData.active ? 'Активен' : 'Неактивен'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>Имя *</Label>
                <Input
                  type="text"
                  placeholder="Введите имя"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Отчество</Label>
                <Input
                  type="text"
                  placeholder="Введите отчество"
                  value={formData.middle_name}
                  onChange={(e) => handleChange("middle_name", e.target.value)}
                />
              </div>

              <div>
                <Label>Фамилия *</Label>
                <Input
                  type="text"
                  placeholder="Введите фамилию"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Пароль *</Label>
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>

              <div>
                <Label>Телефон</Label>
                <Input
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div>
                <Label>Дополнительный телефон</Label>
                <Input
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={formData.additional_phone}
                  onChange={(e) => handleChange("additional_phone", e.target.value)}
                />
              </div>

              <div>
                <Label>Роль</Label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
              Информация о компании
            </h3>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <Label>Название компании</Label>
                <Input
                  type="text"
                  placeholder="ООО 'Компания'"
                  value={formData.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                />
              </div>

              <div>
                <Label>ИНН</Label>
                <Input
                  type="text"
                  placeholder="1234567890"
                  value={formData.inn}
                  onChange={(e) => handleChange("inn", e.target.value)}
                />
              </div>

              <div>
                <Label>КПП</Label>
                <Input
                  type="text"
                  placeholder="123456789"
                  value={formData.kpp}
                  onChange={(e) => handleChange("kpp", e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <Label>ОГРН</Label>
                <Input
                  type="text"
                  placeholder="1234567890123"
                  value={formData.ogrn}
                  onChange={(e) => handleChange("ogrn", e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Юридический адрес</Label>
                <Input
                  type="text"
                  placeholder="г. Москва, ул. Примерная, д. 1"
                  value={formData.legal_address}
                  onChange={(e) => handleChange("legal_address", e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Фактический адрес</Label>
                <Input
                  type="text"
                  placeholder="г. Москва, ул. Примерная, д. 1"
                  value={formData.actual_address}
                  onChange={(e) => handleChange("actual_address", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
              Контактное лицо
            </h3>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>Контактное лицо</Label>
                <Input
                  type="text"
                  placeholder="Иванов Иван Иванович"
                  value={formData.contact_person}
                  onChange={(e) => handleChange("contact_person", e.target.value)}
                />
              </div>

              <div>
                <Label>Контактный телефон</Label>
                <Input
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={formData.contact_phone}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
              Банковские реквизиты
            </h3>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <Label>Название банка</Label>
                <Input
                  type="text"
                  placeholder="ПАО Сбербанк"
                  value={formData.bank_name}
                  onChange={(e) => handleChange("bank_name", e.target.value)}
                />
              </div>

              <div>
                <Label>БИК</Label>
                <Input
                  type="text"
                  placeholder="044525225"
                  value={formData.bik}
                  onChange={(e) => handleChange("bik", e.target.value)}
                />
              </div>

              <div>
                <Label>Расчетный счет</Label>
                <Input
                  type="text"
                  placeholder="40702810000000000000"
                  value={formData.checking_account}
                  onChange={(e) => handleChange("checking_account", e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Корреспондентский счет</Label>
                <Input
                  type="text"
                  placeholder="30101810000000000000"
                  value={formData.correspondent_account}
                  onChange={(e) => handleChange("correspondent_account", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
              Дополнительная информация
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Источник</Label>
                <select
                  value={formData.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="manual">Ручной ввод</option>
                  <option value="website">Сайт</option>
                  <option value="referral">Рекомендация</option>
                  <option value="advertising">Реклама</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <Label>Комментарий</Label>
                <textarea
                  placeholder="Дополнительная информация о пользователе"
                  value={formData.comment}
                  onChange={(e) => handleChange("comment", e.target.value)}
                  rows={4}
                  className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <div>
                <Checkbox
                  label="Активный пользователь"
                  checked={formData.active}
                  onChange={(checked) => handleChange("active", checked)}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Активные пользователи могут входить в систему
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Создание..." : "Создать пользователя"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

