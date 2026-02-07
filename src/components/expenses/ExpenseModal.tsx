import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import DatePicker from "../form/date-picker";
import { useState, useEffect } from "react";
import { expenseService, type CreateExpenseData } from "../../api/expenses";
import { useNotification } from "../../context/NotificationContext";
import { type Expense } from "../../entities/expenses/model";
import Button from "../ui/button/Button";
import ExpenseCategoryAutocomplete from "../form/ExpenseCategoryAutocomplete";

interface ExpenseModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
  onSuccess?: (expense: Expense) => void;
}

export default function ExpenseModal({ isModalOpen, onClose, expense, onSuccess }: ExpenseModalProps) {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateExpenseData>({
    expense_category_id: undefined,
    category: "",
    amount: 0,
    description: "",
    spent_at: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        expense_category_id: expense.expense_category_id,
        category: expense.category,
        amount: expense.amount || 0,
        description: expense.description || "",
        spent_at: expense.spent_at ? expense.spent_at.split("T")[0] : new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        expense_category_id: undefined,
        category: "",
        amount: 0,
        description: "",
        spent_at: new Date().toISOString().split("T")[0],
      });
    }
  }, [expense, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.expense_category_id || formData.amount <= 0) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Категория, Сумма",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result: Expense;
      
      if (expense) {
        result = await expenseService.updateExpense(expense.id, formData);
        showNotification({
          variant: "success",
          title: "Расход обновлен!",
          description: "Расход успешно обновлен",
        });
      } else {
        result = await expenseService.createExpense(formData);
        showNotification({
          variant: "success",
          title: "Расход создан!",
          description: "Новый расход успешно добавлен",
        });
      }

      onSuccess?.(result);
      onClose();
    } catch (error) {
      showNotification({
        variant: "error",
        title: expense ? "Ошибка обновления" : "Ошибка создания",
        description: error instanceof Error ? error.message : "Не удалось сохранить расход",
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
          {expense ? "Редактировать расход" : "Добавить новый расход"}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ExpenseCategoryAutocomplete
            label="Категория"
            placeholder="Введите название категории"
            value={formData.expense_category_id ?? null}
            onChange={(categoryId) =>
              setFormData((prev) => ({ ...prev, expense_category_id: categoryId ?? undefined }))
            }
            required
          />

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
              id={`expense-spent-at-${expense?.id || 'new'}`}
              label="Дата расхода *"
              placeholder="Выберите дату"
              defaultDate={formData.spent_at || undefined}
              onChange={(_dates, dateStr) => {
                setFormData((prev) => ({ ...prev, spent_at: dateStr || "" }));
              }}
            />
          </div>

          <div>
            <Label>Описание</Label>
            <textarea
              className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-24 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Введите описание..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
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
              {isSubmitting ? "Сохранение..." : expense ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
