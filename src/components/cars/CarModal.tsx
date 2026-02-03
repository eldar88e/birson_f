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
  onSuccess?: (car: Car) => void;
}

export default function CarModal({ isModalOpen, onClose, ownerId, onSuccess }: CarModalProps) {
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

  const [errors, setErrors] = useState<{
    owner_id: boolean;
    brand: boolean;
    license_plate: boolean;
  }>({
    owner_id: false,
    brand: false,
    license_plate: false,
  });

  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      owner_id: !formData.owner_id,
      brand: !formData.brand.trim(),
      license_plate: !formData.license_plate.trim(),
    };

    setErrors(newErrors);

    if (newErrors.owner_id || newErrors.brand || newErrors.license_plate) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Владелец, Марка, Номер",
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

      showNotification({
        variant: "success",
        title: "Автомобиль создан!",
        description: "Новый автомобиль успешно добавлен",
      });

      onSuccess?.(car);
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
      setErrors({
        owner_id: false,
        brand: false,
        license_plate: false,
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

    if (errors.owner_id) {
      setErrors((prev) => ({ ...prev, owner_id: false }));
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({
      owner_id: false,
      brand: false,
      license_plate: false,
    });
  };

  return (
    <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
            Добавить новый автомобиль
          </h4>
          <form className="space-y-4">
            {ownerId === 0 && (
              <div>
                <Label>Владелец *</Label>
                <div className={errors.owner_id ? "ring-2 ring-error-500 rounded-lg" : ""}>
                  <UserAutocomplete
                    placeholder="Введите имя или номер телефона"
                    value={selectedUser}
                    onChange={handleUserChange}
                  />
                </div>
                {errors.owner_id && (
                  <p className="mt-1.5 text-xs text-error-500">Выберите владельца</p>
                )}
              </div>
            )}

            <div>
              <Label>Марка *</Label>
              <Input
                type="text"
                placeholder="Введите марку"
                value={formData.brand}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, brand: e.target.value }));
                  // Очищаем ошибку при вводе
                  if (errors.brand) {
                    setErrors((prev) => ({ ...prev, brand: false }));
                  }
                }}
                error={errors.brand}
                hint={errors.brand ? "Заполните марку автомобиля" : ""}
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
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, license_plate: e.target.value }));
                  // Очищаем ошибку при вводе
                  if (errors.license_plate) {
                    setErrors((prev) => ({ ...prev, license_plate: false }));
                  }
                }}
                error={errors.license_plate}
                hint={errors.license_plate ? "Заполните номер автомобиля" : ""}
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
