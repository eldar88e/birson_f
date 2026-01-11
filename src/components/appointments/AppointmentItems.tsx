import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { appointmentItemService, type AppointmentItem, type AppointmentItemPerformer, type AppointmentItemPerformerAttribute } from "../../api/appointmetItems";
import { useNotification } from "../../context/NotificationContext";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import SvgIcon from "../../shared/ui/SvgIcon";
import { StatusBadge } from "../../shared/ui/StatusBadge";
import PerformerAutocomplete from "../form/PerformerAutocomplete";
import ServiceAutocomplete from "../form/ServiceAutocomplete";
import CarAutocomplete from "../form/CarAutocomplete";
import { APPOINTMENT_ITEM_STATES } from "../../entities/appointmentItem/model";
import type { Car } from "../../entities/car/model";
import { carService } from "../../api/cars";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";
import { ConfirmDeleteModal } from "../../shared/ui/ConfirmDeleteModal";

interface AppointmentItemProps {
  appointmentId?: number;
  clientId: number;
  items?: AppointmentItem[];
}

export default function AppointmentItems({ appointmentId, clientId, items }: AppointmentItemProps) {
  const { showNotification } = useNotification();
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const [appointmentItems, setAppointmentItems] = useState<AppointmentItem[]>(items || []);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [performers, setPerformers] = useState<AppointmentItemPerformer[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Omit<AppointmentItem, "id" | "order_id" | "order_item_performers">>({
    service_id: 0,
    car_id: 0,
    state: "initial",
    materials_price: 0,
    materials_comment: "",
    delivery_price: 0,
    delivery_comment: "",
    price: 0,
    paid: false,
    comment: "",
    order_item_performers_attributes: [],
  });

  useEffect(() => {
    if (appointmentItems) setAppointmentItems(appointmentItems);
  }, [appointmentItems]);

  const normalizeAppointmentItem = (item: any): AppointmentItem => {
    const normalized: AppointmentItem = {
      ...item,
      id: typeof item.id === "string" ? parseInt(item.id, 10) : item.id,
      order_id: typeof item.order_id === "string" ? parseInt(item.order_id, 10) : item.order_id,
      service_id: typeof item.service_id === "string" ? parseInt(item.service_id, 10) : item.service_id,
      car_id: typeof item.car_id === "string" ? parseInt(item.car_id, 10) : (item.car_id || 0),
      price: typeof item.price === "string" ? parseFloat(item.price) : Number(item.price) || 0,
      materials_price: typeof item.materials_price === "string" ? parseFloat(item.materials_price) : Number(item.materials_price) || 0,
      delivery_price: typeof item.delivery_price === "string" ? parseFloat(item.delivery_price) : Number(item.delivery_price) || 0,
      paid: typeof item.paid === "string" ? item.paid === "true" : Boolean(item.paid),
    };
    return normalized;
  };

  const deleteModal = useConfirmDelete({
    onDelete: () =>
      appointmentItemService.delete(appointmentId || 0, itemToDelete || 0),
    onSuccess: () =>
      setAppointmentItems((prev) =>
        prev.filter((a) => a.id !== itemToDelete)
      ),
    successMessage: "Позиция в записи удалена",
    errorMessage: "Не удалось удалить позицию в записи",
    useApi: !!appointmentId,
  });

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

      const numberFields: (keyof typeof prev)[] = ["service_id", "materials_price", "delivery_price", "price"];
      if (numberFields.includes(name as keyof typeof prev)) {
        const numValue = value === "" ? 0 : Number(value);
        return { ...prev, [name]: (isNaN(numValue) ? 0 : numValue) as any };
      }

      if (name === "state") {
        return { ...prev, state: value as AppointmentItem["state"] };
      }

      return { ...prev, [name]: value as any };
    });
  };

  const handleOpenModal = () => {
    setEditingItemId(null);
    setSelectedCar(null);
    setFormData({
      service_id: 0,
      car_id: 0,
      state: "initial",
      materials_price: 0,
      materials_comment: "",
      delivery_price: 0,
      delivery_comment: "",
      price: 0,
      paid: false,
      comment: "",
    });
    setPerformers([]);
    openModal();
  };

  const handleEditItem = async (item: AppointmentItem) => {
    setEditingItemId(item.id ?? null);
    setFormData({
      service_id: item.service_id,
      car_id: item.car_id || 0,
      state: item.state,
      materials_price: item.materials_price,
      materials_comment: item.materials_comment,
      delivery_price: item.delivery_price,
      delivery_comment: item.delivery_comment,
      price: item.price,
      paid: item.paid,
      comment: item.comment,
    });
    
    // Load car if car_id exists
    if (item.car_id && clientId) {
      try {
        const cars = await carService.getCarsByOwner(clientId);
        const car = cars.find(c => c.id === item.car_id);
        setSelectedCar(car || null);
      } catch {
        setSelectedCar(null);
      }
    } else {
      setSelectedCar(null);
    }
    
    // Load performers for editing
    if (item.order_item_performers && item.order_item_performers.length > 0) {
      setPerformers(item.order_item_performers.map(p => ({
        id: p.id,
        performer_id: p.performer_id,
        performer_type: p.performer_type,
        performer_fee: p.performer_fee,
        performer_name: p.performer_name,
      })));
    } else {
      setPerformers([]);
    }
    openModal();
  };

  const addPerformer = () => {
    setPerformers((prev) => [
      ...prev,
      {
        performer_id: 0,
        performer_type: "User",
        performer_fee: 0,
      },
    ]);
  };

  const removePerformer = (index: number) => {
    setPerformers((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePerformer = (index: number, updates: Partial<AppointmentItemPerformer>) => {
    setPerformers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.service_id || formData.price <= 0) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Услуга и цена",
      });
      return;
    }

    // Validate performers
    const validPerformers = performers.filter((p) => p.performer_id > 0);
    if (validPerformers.length === 0) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Добавьте хотя бы одного исполнителя",
      });
      return;
    }

    const order_item_performers_attributes: AppointmentItemPerformerAttribute[] = validPerformers.map((p) => ({
      id: p.id,
      performer_id: p.performer_id,
      performer_type: p.performer_type,
      performer_fee: p.performer_fee,
      _destroy: p._destroy,
    }));

    if (appointmentId) {
      try {
        if (editingItemId) {
          // Update existing item
          const updatedItem = await appointmentItemService.updateAppointmentItem(appointmentId, editingItemId, {
            order_id: appointmentId,
            ...formData,
            order_item_performers_attributes,
          });

          const normalizedItem = normalizeAppointmentItem(updatedItem);
          setAppointmentItems((prev) =>
            prev.map((item) => (item.id === editingItemId ? normalizedItem : item))
          );
          showNotification({
            variant: "success",
            title: "Позиция обновлена",
            description: "Позиция успешно обновлена",
          });
        } else {
          // Create new item
          const newItem = await appointmentItemService.createAppointmentItem(appointmentId, {
            order_id: appointmentId,
            ...formData,
            order_item_performers_attributes,
          });

          const normalizedItem = normalizeAppointmentItem(newItem);
          setAppointmentItems((prev) => [...prev, normalizedItem]);
          showNotification({
            variant: "success",
            title: "Позиция добавлена",
            description: "Позиция успешно добавлена в заказ",
          });
        }
        closeModal();
      } catch (error) {
        showNotification({
          variant: "error",
          title: editingItemId ? "Ошибка обновления" : "Ошибка добавления",
          description: error instanceof Error ? error.message : (editingItemId ? "Не удалось обновить позицию" : "Не удалось добавить позицию"),
        });
      }
    } else {
      const newItem: AppointmentItem = {
        id: Date.now(),
        order_id: 0,
        ...formData
      };
      setAppointmentItems((prev) => [...prev, newItem]);
      closeModal();
    }
  };

  const subtotal: number = appointmentItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const materialsTotal: number = appointmentItems.reduce((sum, item) => sum + Number(item.materials_price || 0), 0);
  const deliveryTotal: number = appointmentItems.reduce((sum, item) => sum + Number(item.delivery_price || 0), 0);
  const performerFeeTotal: number = appointmentItems.reduce((sum, item) => {
    if (item.order_item_performers && item.order_item_performers.length > 0) {
      return sum + item.order_item_performers.reduce((pSum, p) => pSum + Number(p.performer_fee || 0), 0);
    }
    // Legacy support
    const legacyFee = (item as any).performer_fee;
    return sum + Number(legacyFee ?? 0);
  }, 0);
  const total: number = subtotal + materialsTotal + deliveryTotal + performerFeeTotal;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Позиции записи</h3>
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
                  Сервис
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
                  Зарплата
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
              {appointmentItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-4 text-center text-gray-400">
                    Позиции не добавлены
                  </td>
                </tr>
              ) : (
                appointmentItems.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.service}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.order_item_performers && item.order_item_performers.length > 0 ? (
                        <div className="space-y-1">
                          {item.order_item_performers.map((performer, pIdx) => (
                            <div key={pIdx}>
                              {performer.performer_type === "User" ? (
                                <a href={`/users/${performer.performer_id}`}>
                                  Сотрудник: {performer.performer_name}
                                </a>
                              ) : (
                                <div>Подрядчик: {performer.performer_name}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400">Нет исполнителей</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <StatusBadge state={item.state} />
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {Number(item.price || 0).toFixed(2)} ₽
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.order_item_performers && item.order_item_performers.length > 0 ? (
                        <div className="space-y-1">
                          {item.order_item_performers.map((performer: AppointmentItemPerformer, pIdx: number) => (
                            <div key={pIdx}>
                              {Number(performer.performer_fee || 0) > 0 
                                ? `${Number(performer.performer_fee || 0).toFixed(2)} ₽` 
                                : "-"}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {Number(item.materials_price || 0) > 0 ? `${Number(item.materials_price || 0).toFixed(2)} ₽` : "-"}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {Number(item.delivery_price || 0) > 0 ? `${Number(item.delivery_price || 0).toFixed(2)} ₽` : "-"}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.paid ? (
                        <span className="text-success-600 dark:text-success-500">Да</span>
                      ) : (
                        <span className="text-gray-400">Нет</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="text-xs flex rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          title="Редактировать"
                        >
                          <svg width="18" height="18" stroke="CurrentColor" fill="CurrentColor" aria-hidden="true" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
                          </svg>
                        </button>
                        <button 
                          onClick={() => {
                            setItemToDelete(item.id ?? null);
                            deleteModal.open();
                            }}
                          className="text-xs flex rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          title="Удалить"
                        >
                          <svg
                            className="hover:fill-error-500 dark:hover:fill-error-500 cursor-pointer fill-gray-700 dark:fill-gray-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.54142 3.7915C6.54142 2.54886 7.54878 1.5415 8.79142 1.5415H11.2081C12.4507 1.5415 13.4581 2.54886 13.4581 3.7915V4.0415H15.6252H16.666C17.0802 4.0415 17.416 4.37729 17.416 4.7915C17.416 5.20572 17.0802 5.5415 16.666 5.5415H16.3752V8.24638V13.2464V16.2082C16.3752 17.4508 15.3678 18.4582 14.1252 18.4582H5.87516C4.63252 18.4582 3.62516 17.4508 3.62516 16.2082V13.2464V8.24638V5.5415H3.3335C2.91928 5.5415 2.5835 5.20572 2.5835 4.7915C2.5835 4.37729 2.91928 4.0415 3.3335 4.0415H4.37516H6.54142V3.7915ZM14.8752 13.2464V8.24638V5.5415H13.4581H12.7081H7.29142H6.54142H5.12516V8.24638V13.2464V16.2082C5.12516 16.6224 5.46095 16.9582 5.87516 16.9582H14.1252C14.5394 16.9582 14.8752 16.6224 14.8752 16.2082V13.2464ZM8.04142 4.0415H11.9581V3.7915C11.9581 3.37729 11.6223 3.0415 11.2081 3.0415H8.79142C8.37721 3.0415 8.04142 3.37729 8.04142 3.7915V4.0415ZM8.3335 7.99984C8.74771 7.99984 9.0835 8.33562 9.0835 8.74984V13.7498C9.0835 14.1641 8.74771 14.4998 8.3335 14.4998C7.91928 14.4998 7.5835 14.1641 7.5835 13.7498V8.74984C7.5835 8.33562 7.91928 7.99984 8.3335 7.99984ZM12.4168 8.74984C12.4168 8.33562 12.081 7.99984 11.6668 7.99984C11.2526 7.99984 10.9168 8.33562 10.9168 8.74984V13.7498C10.9168 14.1641 11.2526 14.4998 11.6668 14.4998C12.081 14.4998 12.4168 14.1641 12.4168 13.7498V8.74984Z"
                              fill=""
                            />
                          </svg>
                        </button>
                        <ConfirmDeleteModal
                          isOpen={deleteModal.isOpen}
                          isLoading={deleteModal.isLoading}
                          onClose={deleteModal.close}
                          onConfirm={deleteModal.confirm}
                          itemName={`Позиция в записи №${idx + 1}`}
                        />
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
              <span className="text-sm text-gray-500 dark:text-gray-400">Зарплата</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                {performerFeeTotal.toFixed(2)} ₽
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          closeModal();
          setEditingItemId(null);
        }}
        className="max-w-3xl p-4 sm:p-6 lg:p-8 sm:m-4 sm:rounded-3xl"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
            {editingItemId ? "Редактировать позицию в записи" : "Добавить позицию в запись"}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <ServiceAutocomplete
                  label="Услуга *"
                  placeholder="Введите название услуги"
                  value={formData.service_id === 0 ? null : formData.service_id}
                  onChange={(serviceId, _service) => {
                    setFormData((prev) => ({
                      ...prev,
                      service_id: serviceId || 0,
                    }));
                  }}
                />
              </div>

              <div>
                <CarAutocomplete
                  label="Автомобиль"
                  placeholder="Нажмите для выбора автомобиля"
                  value={selectedCar}
                  onChange={(car) => {
                    setSelectedCar(car);
                    setFormData((prev) => ({
                      ...prev,
                      car_id: car ? car.id : 0,
                    }));
                  }}
                  ownerId={clientId}
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
                  {APPOINTMENT_ITEM_STATES.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
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
            </div>

            {/* Performers Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Исполнители *</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPerformer}
                  className="text-sm"
                >
                  <SvgIcon name="plus" width={16} />
                  Добавить исполнителя
                </Button>
              </div>
              
              {performers.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  Исполнители не добавлены. Нажмите "Добавить исполнителя" для добавления.
                </div>
              ) : (
                <div className="space-y-3">
                  {performers.map((performer, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Label>Исполнитель {index + 1}</Label>
                        <button
                          type="button"
                          onClick={() => removePerformer(index)}
                          className="text-error-500 hover:text-error-600 text-sm"
                        >
                          <SvgIcon name="trash" width={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <Label>Тип исполнителя</Label>
                          <select
                            value={performer.performer_type}
                            onChange={(e) =>
                              updatePerformer(index, {
                                performer_type: e.target.value as "User" | "Contractor",
                                performer_id: 0,
                              })
                            }
                            className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                          >
                            <option value="User">Сотрудник</option>
                            <option value="Contractor">Подрядчик</option>
                          </select>
                        </div>

                        <div>
                          <PerformerAutocomplete
                            label="Исполнитель"
                            placeholder={performer.performer_type === "User" ? "Введите имя или номер телефона пользователя" : "Введите имя или номер телефона контрагента"}
                            value={performer.performer_id === 0 ? null : performer.performer_id}
                            performerType={performer.performer_type}
                            onChange={(performerId, _performer) => {
                              updatePerformer(index, { performer_id: performerId || 0 });
                            }}
                          />
                        </div>

                        <div>
                          <Label>Вознаграждение</Label>
                          <Input
                            type="number"
                            value={performer.performer_fee || ""}
                            onChange={(e) => {
                              const numValue = e.target.value === "" ? 0 : Number(e.target.value);
                              updatePerformer(index, {
                                performer_fee: isNaN(numValue) ? 0 : numValue,
                              });
                            }}
                            placeholder="0.00"
                            min="0"
                            step={0.01}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

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
                {editingItemId ? "Сохранить" : "Добавить"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
