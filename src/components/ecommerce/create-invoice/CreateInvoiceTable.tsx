import { useState, useEffect } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { orderItemService, type OrderItem } from "../../../api/orderItems";
import { useNotification } from "../../../context/NotificationContext";
import { Modal } from "../../../components/ui/modal";
import { useModal } from "../../../hooks/useModal";
import SvgIcon from "../../../shared/ui/SvgIcon";

interface CreateInvoiceTableProps {
  orderId?: number;
  onItemsChange?: (items: OrderItem[]) => void;
}

const CreateInvoiceTable: React.FC<CreateInvoiceTableProps> = ({ orderId, onItemsChange }) => {
  const { showNotification } = useNotification();
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<OrderItem, "id" | "order_id">>({
    service_id: 0,
    performer_type: "User" as OrderItem["performer_type"],
    performer_id: 0,
    state: "initial",
    materials_price: 0,
    materials_comment: "",
    delivery_price: 0,
    delivery_comment: "",
    price: 0,
    paid: false,
    comment: "",
  });

  useEffect(() => {
    if (orderId) {
      loadOrderItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    // Уведомляем родителя об изменении позиций
    onItemsChange?.(items);
  }, [items, onItemsChange]);

  const loadOrderItems = async () => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      const loadedItems = await orderItemService.getOrderItems(orderId);
      setItems(loadedItems);
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Не удалось загрузить позиции",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId: number): Promise<void> => {
    if (!orderId) {
      // Локальное удаление (если order еще не создан)
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }

    // Удаление через API (если order уже создан)
    try {
      await orderItemService.deleteOrderItem(orderId, itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      showNotification({
        variant: "success",
        title: "Позиция удалена",
        description: "Позиция успешно удалена из заказа",
      });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка удаления",
        description: error instanceof Error ? error.message : "Не удалось удалить позицию",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }
      
      if (type === "number") {
        const numValue = value === "" ? 0 : Number(value);
        return { ...prev, [name]: isNaN(numValue) ? 0 : numValue };
      }

      // Для select с числовыми значениями
      const numberFields: (keyof typeof prev)[] = ["service_id", "performer_id", "materials_price", "delivery_price", "price"];
      if (numberFields.includes(name as keyof typeof prev)) {
        const numValue = value === "" ? 0 : Number(value);
        return { ...prev, [name]: (isNaN(numValue) ? 0 : numValue) as any };
      }

      // Для select с enum значениями
      if (name === "state") {
        return { ...prev, state: value as OrderItem["state"] };
      }

      if (name === "performer_type") {
        return { ...prev, performer_type: value as OrderItem["performer_type"] };
      }

      return { ...prev, [name]: value as any };
    });
  };

  const handleOpenModal = () => {
    setFormData({
      service_id: 0,
      performer_type: "User" as OrderItem["performer_type"],
      performer_id: 0,
      state: "initial",
      materials_price: 0,
      materials_comment: "",
      delivery_price: 0,
      delivery_comment: "",
      price: 0,
      paid: false,
      comment: "",
    });
    openModal();
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.service_id || formData.price <= 0) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: ID услуги и цена",
      });
      return;
    }

    if (orderId) {
      try {
        const newItem = await orderItemService.createOrderItem(orderId, {
          order_id: orderId,
          ...formData,
        });

        setItems((prev) => [...prev, newItem]);
        showNotification({
          variant: "success",
          title: "Позиция добавлена",
          description: "Позиция успешно добавлена в заказ",
        });
        closeModal();
      } catch (error) {
        showNotification({
          variant: "error",
          title: "Ошибка добавления",
          description: error instanceof Error ? error.message : "Не удалось добавить позицию",
        });
      }
    } else {
      // Локальное добавление (если order еще не создан)
      const newItem: OrderItem = {
        id: Date.now(), // Временный ID
        order_id: 0,
        ...formData,
      };
      setItems((prev) => [...prev, newItem]);
      closeModal();
    }
  };

  const subtotal: number = items.reduce((sum, item) => sum + item.price, 0);
  const materialsTotal: number = items.reduce((sum, item) => sum + item.materials_price, 0);
  const deliveryTotal: number = items.reduce((sum, item) => sum + item.delivery_price, 0);
  const total: number = subtotal + materialsTotal + deliveryTotal;

  const getStateLabel = (state: OrderItem["state"]): string => {
    const labels = {
      initial: "В ожидании",
      processing: "В процессе",
      completed: "Завершен",
      cancelled: "Отменен",
    };
    return labels[state];
  };

  return (
    <div className="space-y-6">
      {/* Items Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Позиции заказа</h3>
          <Button onClick={handleOpenModal} variant="primary">
            <SvgIcon name="plus" width={16} />
            Добавить позицию
          </Button>
        </div>
        <div className="custom-scrollbar overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-700 dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="border-b border-gray-100 whitespace-nowrap dark:border-gray-800">
                <th className="px-5 py-4 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                  №
                </th>
                <th className="px-5 py-4 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                  ID услуги
                </th>
                <th className="px-5 py-4 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                  Исполнитель
                </th>
                <th className="px-5 py-4 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                  Статус
                </th>
                <th className="px-5 py-4 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                  Цена
                </th>
                <th className="px-5 py-4 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                  Материалы
                </th>
                <th className="px-5 py-4 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                  Доставка
                </th>
                <th className="px-5 py-4 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                  Оплачено
                </th>
                <th className="relative px-5 py-4 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-white/[0.03]">
              {isLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-4 text-center text-gray-400">
                    Загрузка позиций...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-4 text-center text-gray-400">
                    Позиции не добавлены
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.service_id}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.performer_type} #{item.performer_id}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {getStateLabel(item.state)}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.price.toFixed(2)} ₽
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.materials_price > 0 ? `${item.materials_price.toFixed(2)} ₽` : "-"}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.delivery_price > 0 ? `${item.delivery_price.toFixed(2)} ₽` : "-"}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.paid ? (
                        <span className="text-success-600 dark:text-success-500">Да</span>
                      ) : (
                        <span className="text-gray-400">Нет</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center">
                        <svg
                          className="hover:fill-error-500 dark:hover:fill-error-500 cursor-pointer fill-gray-700 dark:fill-gray-400"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => item.id && handleDelete(item.id)}
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.54142 3.7915C6.54142 2.54886 7.54878 1.5415 8.79142 1.5415H11.2081C12.4507 1.5415 13.4581 2.54886 13.4581 3.7915V4.0415H15.6252H16.666C17.0802 4.0415 17.416 4.37729 17.416 4.7915C17.416 5.20572 17.0802 5.5415 16.666 5.5415H16.3752V8.24638V13.2464V16.2082C16.3752 17.4508 15.3678 18.4582 14.1252 18.4582H5.87516C4.63252 18.4582 3.62516 17.4508 3.62516 16.2082V13.2464V8.24638V5.5415H3.3335C2.91928 5.5415 2.5835 5.20572 2.5835 4.7915C2.5835 4.37729 2.91928 4.0415 3.3335 4.0415H4.37516H6.54142V3.7915ZM14.8752 13.2464V8.24638V5.5415H13.4581H12.7081H7.29142H6.54142H5.12516V8.24638V13.2464V16.2082C5.12516 16.6224 5.46095 16.9582 5.87516 16.9582H14.1252C14.5394 16.9582 14.8752 16.6224 14.8752 16.2082V13.2464ZM8.04142 4.0415H11.9581V3.7915C11.9581 3.37729 11.6223 3.0415 11.2081 3.0415H8.79142C8.37721 3.0415 8.04142 3.37729 8.04142 3.7915V4.0415ZM8.3335 7.99984C8.74771 7.99984 9.0835 8.33562 9.0835 8.74984V13.7498C9.0835 14.1641 8.74771 14.4998 8.3335 14.4998C7.91928 14.4998 7.5835 14.1641 7.5835 13.7498V8.74984C7.5835 8.33562 7.91928 7.99984 8.3335 7.99984ZM12.4168 8.74984C12.4168 8.33562 12.081 7.99984 11.6668 7.99984C11.2526 7.99984 10.9168 8.33562 10.9168 8.74984V13.7498C10.9168 14.1641 11.2526 14.4998 11.6668 14.4998C12.081 14.4998 12.4168 14.1641 12.4168 13.7498V8.74984Z"
                            fill=""
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Summary */}
      <div className="flex flex-wrap justify-between sm:justify-end">
        <div className="w-full space-y-1 text-right sm:w-[220px]">
          <p className="mb-4 text-left text-sm font-medium text-gray-800 dark:text-white/90">
            Итого по заказу
          </p>
          <ul className="space-y-2">
            <li className="flex justify-between gap-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Цена услуг</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                {subtotal.toFixed(2)} ₽
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Материалы</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                {materialsTotal.toFixed(2)} ₽
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Доставка</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                {deliveryTotal.toFixed(2)} ₽
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-400">Итого</span>
              <span className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {total.toFixed(2)} ₽
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-3xl p-6 lg:p-8"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
            Добавить позицию в заказ
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>ID услуги *</Label>
                <Input
                  type="number"
                  name="service_id"
                  value={formData.service_id === 0 ? "" : formData.service_id}
                  onChange={handleInputChange}
                  placeholder="Введите ID услуги"
                  required
                  min="1"
                />
              </div>

              <div>
                <Label>Тип исполнителя</Label>
                <select
                  name="performer_type"
                  value={formData.performer_type}
                  onChange={handleInputChange}
                  className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                >
                  <option value="">Выберите тип</option>
                  <option value="User">Пользователь</option>
                  <option value="Contactor">Контактор</option>
                </select>
              </div>

              <div>
                <Label>ID исполнителя</Label>
                <Input
                  type="number"
                  name="performer_id"
                  value={formData.performer_id === 0 ? "" : formData.performer_id}
                  onChange={handleInputChange}
                  placeholder="Введите ID исполнителя"
                  min="0"
                />
              </div>

              <div>
                <Label>Статус</Label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                >
                  <option value="initial">В ожидании</option>
                  <option value="processing">В процессе</option>
                  <option value="completed">Завершен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>

              <div>
                <Label>Цена *</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  min="0"
                  step={0.01}
                />
              </div>

              <div>
                <Label>Оплачено</Label>
                <div className="flex items-center h-11">
                  <input
                    type="checkbox"
                    name="paid"
                    checked={formData.paid}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Да</span>
                </div>
              </div>

              <div>
                <Label>Цена материалов</Label>
                <Input
                  type="number"
                  name="materials_price"
                  value={formData.materials_price || ""}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step={0.01}
                />
              </div>

              <div>
                <Label>Комментарий к материалам</Label>
                <Input
                  type="text"
                  name="materials_comment"
                  value={formData.materials_comment}
                  onChange={handleInputChange}
                  placeholder="Введите комментарий"
                />
              </div>

              <div>
                <Label>Цена доставки</Label>
                <Input
                  type="number"
                  name="delivery_price"
                  value={formData.delivery_price || ""}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step={0.01}
                />
              </div>

              <div>
                <Label>Комментарий к доставке</Label>
                <Input
                  type="text"
                  name="delivery_comment"
                  value={formData.delivery_comment}
                  onChange={handleInputChange}
                  placeholder="Введите комментарий"
                />
              </div>
            </div>

            <div>
              <Label>Комментарий</Label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Введите комментарий..."
                className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-24 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={closeModal}>
                Отмена
              </Button>
              <Button type="submit" variant="primary">
                Добавить
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateInvoiceTable;
