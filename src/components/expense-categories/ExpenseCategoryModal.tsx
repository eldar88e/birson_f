import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState, useEffect } from "react";
import { expenseCategoryService } from "../../api/expense-categories";
import { type CreateExpenseCategoryData, type ExpenseCategory } from "../../entities/expense-category/model";
import { useNotification } from "../../context/NotificationContext";
import Button from "../ui/button/Button";

interface ExpenseCategoryModalProps {
    isModalOpen: boolean;
    onClose: () => void;
    expenseCategory?: ExpenseCategory | null;
    onSuccess?: (expenseCategory: ExpenseCategory) => void;
}

export default function ExpenseCategoryModal({ isModalOpen, onClose, expenseCategory, onSuccess }: ExpenseCategoryModalProps) {
    const { showNotification } = useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreateExpenseCategoryData>({
        title: "",
        description: "",
        active: true,
    });

    useEffect(() => {
        if (expenseCategory) {
            setFormData({
                title: expenseCategory.title || "",
                description: expenseCategory.description || "",
                active: expenseCategory.active ?? true,
            });
        } else {
            setFormData({
                title: "",
                description: "",
                active: true,
            });
        }
    }, [expenseCategory, isModalOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!formData.title.trim()) {
            showNotification({
                variant: "error",
                title: "Ошибка валидации",
                description: "Необходимо указать название категории",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            let result: ExpenseCategory;
            
            if (expenseCategory?.id) {
                result = await expenseCategoryService.update(expenseCategory.id, formData);
                showNotification({
                    variant: "success",
                    title: "Категория расходов обновлена!",
                    description: "Категория расходов успешно отредактирована",
                });
            } else {
                result = await expenseCategoryService.create(formData);
                showNotification({
                    variant: "success",
                    title: "Категория расходов создана!",
                    description: "Новая категория расходов успешно добавлена",
                });
            }

            onSuccess?.(result);
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Не удалось сохранить категорию расходов";
            showNotification({
                variant: "error",
                title: expenseCategory?.id ? "Ошибка обновления" : "Ошибка создания",
                description: errorMessage,
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
                    {expenseCategory?.id ? "Редактировать категорию расходов" : "Добавить новую категорию расходов"}
                </h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Название *</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Введите название категории"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Описание</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Введите описание категории"
                        />
                    </div>
                    <div>
                        <Label htmlFor="active">Активность</Label>
                        <div className="flex items-center h-11">
                            <input
                                id="active"
                                name="active"
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Активна</span>
                        </div>
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
                            {isSubmitting ? "Сохранение..." : expenseCategory?.id ? "Сохранить" : "Добавить"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
