import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState } from "react";
import { carService, type CreateCarData } from "../../api/cars";
import { useNotification } from "../../context/NotificationContext";
import UserAutocomplete from "../form/UserAutocomplete";
import type { User } from "../../entities/user/model";
import type { Car } from "../../entities/car/model";

interface CarModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  ownerId: number;
  cars: Car[];
}

export default function CarModal({ isModalOpen, onClose, ownerId, cars }: CarModalProps) {
  const { showNotification } = useNotification();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    brand: string;
    model: string;
    license_plate: string;
    vin: string;
    year: number;
    owner_id: number;
    comment: string;
  }>({
    brand: "",
    model: "",
    license_plate: "",
    vin: "",
    year: new Date().getFullYear(),
    owner_id: ownerId || 0,
    comment: "",
  });

  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.brand || !formData.model || !formData.license_plate) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Марка, Модель, Номер",
      });
      return;
    }

    try {
      const carData: CreateCarData = {
        brand: formData.brand,
        model: formData.model,
        license_plate: formData.license_plate,
        vin: formData.vin,
        year: formData.year,
        owner_id: formData.owner_id,
        comment: formData.comment,
      };

      const car = await carService.createCar(carData);
      cars.push(car);
      console.log(car);

      showNotification({
        variant: "success",
        title: "Автомобиль создан!",
        description: "Новый автомобиль успешно добавлен",
      });

      onClose();

      setFormData({
        brand: "",
        model: "",
        license_plate: "",
        vin: "",
        year: new Date().getFullYear(),
        owner_id: ownerId,
        comment: "",
      });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка создания",
        description: `Не удалось создать автомобиль. ${error}`,
      });
    }
  };

  const handleUserChange = (user: User | null) => {
    setSelectedUser(user);
    setFormData((prev) => ({ ...prev, owner_id: user?.id || 0 }));
  };

  return (
    <Modal
        isOpen={isModalOpen}
        onClose={onClose}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
            Добавить новый автомобиль
          </h4>
          <form className="space-y-4">
            {ownerId === 0 && (
              <div>
                <UserAutocomplete
                  label="Владелец"
                  placeholder="Введите имя или номер телефона"
                  value={selectedUser}
                  onChange={handleUserChange}
                />
              </div>
            )}

            <div>
              <Label>Марка *</Label>
              <Input
                type="text"
                placeholder="Введите марку"
                value={formData.brand}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, brand: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label>Модель *</Label>
              <Input
                type="text"
                placeholder="Введите модель"
                value={formData.model}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, model: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label>Номер *</Label>
              <Input
                type="text"
                placeholder="А123БВ777"
                value={formData.license_plate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, license_plate: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label>VIN</Label>
              <Input
                type="text"
                placeholder="Введите VIN"
                value={formData.vin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, vin: e.target.value }))
                }
              />
            </div>

            <div>
              <Label>Год</Label>
              <Input
                type="number"
                placeholder="2020"
                value={formData.year === 0 ? "" : formData.year}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = value === "" ? 0 : Number(value);
                  setFormData((prev) => ({ ...prev, year: isNaN(numValue) ? 0 : numValue }));
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
              <button
                type="button"
                onClick={handleCreateCar}
                className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      </Modal>
  );
}
