import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import DatePicker from "../form/date-picker";
import { useState, useEffect } from "react";
import { investmentService, type CreateInvestmentData } from "../../api/investment";
import { useNotification } from "../../context/NotificationContext";
import { type Investment } from "../../entities/investment/model";
import Button from "../ui/button/Button";
import UserAutocomplete from "../form/UserAutocomplete";
import { userService } from "../../api/users";
import { type User } from "../../entities/user/model";

interface InvestmentModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  investment?: Investment | null;
  onSuccess?: (investment: Investment) => void;
}

export default function InvestmentModal({ isModalOpen, onClose, investment, onSuccess }: InvestmentModalProps) {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateInvestmentData>({
    amount: 0,
    comment: "",
    invested_at: new Date().toISOString().split("T")[0],
    user_id: undefined,
  });

  useEffect(() => {
    const loadUser = async () => {
      if (investment?.user_id) {
        try {
          const user = await userService.getUser(investment.user_id);
          setSelectedUser(user);
        } catch (error) {
          // Ignore error, user might not exist
          setSelectedUser(null);
        }
      } else {
        setSelectedUser(null);
      }
    };

    if (investment) {
      setFormData({
        amount: investment.amount || 0,
        comment: investment.comment || "",
        invested_at: investment.invested_at ? investment.invested_at.split("T")[0] : new Date().toISOString().split("T")[0],
        user_id: investment.user_id,
      });
      loadUser();
    } else {
      setFormData({
        amount: 0,
        comment: "",
        invested_at: new Date().toISOString().split("T")[0],
        user_id: undefined,
      });
      setSelectedUser(null);
    }
  }, [investment, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.amount <= 0) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Сумма должна быть больше нуля",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result: Investment;
      
      if (investment) {
        result = await investmentService.updateInvestment(investment.id, formData);
        showNotification({
          variant: "success",
          title: "Инвестиция обновлена!",
          description: "Инвестиция успешно обновлена",
        });
      } else {
        result = await investmentService.createInvestment(formData);
        showNotification({
          variant: "success",
          title: "Инвестиция создана!",
          description: "Новая инвестиция успешно добавлена",
        });
      }

      onSuccess?.(result);
      onClose();
    } catch (error) {
      showNotification({
        variant: "error",
        title: investment ? "Ошибка обновления" : "Ошибка создания",
        description: error instanceof Error ? error.message : "Не удалось сохранить инвестицию",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      className="max-w-[500px] p-6 lg:p-8"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
          {investment ? "Редактировать инвестицию" : "Добавить новую инвестицию"}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <UserAutocomplete
              label="Пользователь"
              placeholder="Введите имя или номер телефона"
              value={selectedUser}
              onChange={(user) => {
                setSelectedUser(user);
                setFormData((prev) => ({ ...prev, user_id: user?.id }));
              }}
            />
          </div>

          <div>
            <Label>Сумма *</Label>
            <Input
              type="number"
              step={1}
              min="0"
              placeholder="Введите сумму"
              value={formData.amount === 0 ? "" : formData.amount}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value === "" ? 0 : parseFloat(value);
                setFormData((prev) => ({ ...prev, amount: isNaN(numValue) ? 0 : numValue }));
              }}
              required
            />
          </div>

          <div>
            <DatePicker
              id={`investment-invested-at-${investment?.id || 'new'}`}
              label="Дата инвестиции *"
              placeholder="Выберите дату"
              defaultDate={formData.invested_at || undefined}
              onChange={(_dates, dateStr) => {
                setFormData((prev) => ({ ...prev, invested_at: dateStr || "" }));
              }}
            />
          </div>

          <div>
            <Label>Комментарий</Label>
            <textarea
              className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-24 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Введите комментарий..."
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Сохранение..." : investment ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
