import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState, useEffect } from "react";
import { carService } from "../../api/cars";
import { useNotification } from "../../context/NotificationContext";
import UserAutocomplete from "../form/UserAutocomplete";
import type { User } from "../../entities/user/model";
import type { Car } from "../../entities/car/model";
import { userService } from "../../api/users";

interface CarModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  ownerId: number;
  car?: Car | null;
  onSuccess?: (car: Car) => void;
}

export default function CarModal({ isModalOpen, onClose, ownerId, car, onSuccess }: CarModalProps) {
  const { showNotification } = useNotification();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoadingOwner, setIsLoadingOwner] = useState(false);
  const [formData, setFormData] = useState<{
    brand: string;
    model: string;
    license_plate: string;
    vin: string;
    year: number | null;
    owner_id: number;
    comment: string;
  }>({
    brand: "",
    model: "",
    license_plate: "",
    vin: "",
    year: null,
    owner_id: ownerId || 0,
    comment: "",
  });

  const [errors, setErrors] = useState<{
    owner_id: boolean;
    brand: boolean;
  }>({
    owner_id: false,
    brand: false,
  });

  useEffect(() => {
    if (car) {
      setFormData({
        brand: car.brand,
        model: car.model,
        license_plate: car.license_plate,
        vin: car.vin || "",
        year: car.year,
        owner_id: car.owner_id,
        comment: car.comment || "",
      });
    } else {
      setFormData({
        brand: "",
        model: "",
        license_plate: "",
        vin: "",
        year: null,
        owner_id: ownerId || 0,
        comment: "",
      });
    }
    setErrors({
      owner_id: false,
      brand: false
    });
  }, [car, ownerId, isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const idToLoad = car?.owner_id || ownerId || 0;
    if (!idToLoad) {
      setSelectedUser(null);
      return;
    }

    // Avoid overwriting user's manual selection in the same modal session
    if (selectedUser?.id === idToLoad) return;

    setIsLoadingOwner(true);
    userService
      .getUser(idToLoad)
      .then((user) => setSelectedUser(user))
      .catch((e) => {
        console.error("Failed to load car owner:", e);
        setSelectedUser(null);
      })
      .finally(() => setIsLoadingOwner(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, car?.owner_id, ownerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      owner_id: !formData.owner_id,
      brand: !formData.brand.trim(),
    };

    setErrors(newErrors);

    if (newErrors.owner_id || newErrors.brand) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Владелец, Марка",
      });
      return;
    }

    try {
      const carData = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        license_plate: formData.license_plate.trim(),
        vin: formData.vin.trim(),
        year: formData.year,
        owner_id: formData.owner_id,
        comment: formData.comment.trim(),
      };

      let updatedCar: Car;

      if (car?.id) {
        updatedCar = await carService.updateCar(car.id, carData);
        showNotification({
          variant: "success",
          title: "Автомобиль обновлен!",
          description: "Данные автомобиля успешно обновлены",
        });
      } else {
        updatedCar = await carService.createCar(carData);
        showNotification({
          variant: "success",
          title: "Автомобиль создан!",
          description: "Новый автомобиль успешно добавлен",
        });
      }

      onSuccess?.(updatedCar);
      handleClose();
    } catch (error) {
      showNotification({
        variant: "error",
        title: car?.id ? "Ошибка обновления" : "Ошибка создания",
        description: `Не удалось ${car?.id ? "обновить" : "создать"} автомобиль. ${error}`,
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
            {car?.id ? "Редактировать автомобиль" : "Добавить новый автомобиль"}
          </h4>
          <form className="space-y-4">
            <div>
              <Label>Владелец *</Label>
              <div className={errors.owner_id ? "ring-2 ring-error-500 rounded-lg" : ""}>
                <UserAutocomplete
                  placeholder={isLoadingOwner ? "Загрузка владельца..." : "Введите имя или номер телефона"}
                  value={selectedUser}
                  onChange={handleUserChange}
                  disabled={isLoadingOwner}
                />
              </div>
              {errors.owner_id && (
                <p className="mt-1.5 text-xs text-error-500">Выберите владельца</p>
              )}
            </div>

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
                }}
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
                placeholder={new Date().getFullYear().toString()}
                min="1"
                max={new Date().getFullYear().toString()}
                value={formData.year === null ? "" : formData.year}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setFormData((prev) => ({ ...prev, year: null }));
                  } else {
                    const numValue = Number(value);
                    if (!isNaN(numValue)) {
                      setFormData((prev) => ({ ...prev, year: numValue }));
                    }
                  }
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
                onClick={handleClose}
                className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {car?.id ? "Сохранить" : "Создать"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
  );
}
