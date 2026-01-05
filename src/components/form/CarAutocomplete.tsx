import { useState, useEffect, useRef } from "react";
import { carService, type CreateCarData } from "../../api/cars";
import type { Car } from "../../entities/car/model";
import Label from "./Label";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../context/NotificationContext";
import Input from "./input/InputField";
import SvgIcon from "../../shared/ui/SvgIcon";
import { useCarSearch } from "../../hooks/useCarSearch";
import { useClickOutside } from "../../hooks/useClickOutside";

interface CarAutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: Car | null;
  onChange?: (car: Car | null) => void;
  className?: string;
  ownerId?: number;
}

export default function CarAutocomplete({
  label,
  placeholder = "Нажмите для выбора автомобиля",
  value,
  onChange,
  className = "",
  ownerId,
}: CarAutocompleteProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { showNotification } = useNotification();
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

  const { cars, isLoading, loadCars } = useCarSearch(ownerId);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const getCarDisplayName = (car: Car): string => {
    const parts = [car.brand, car.model, car.license_plate].filter(Boolean);
    return parts.join(" ") || `ID: ${car.id}`;
  };

  useEffect(() => {
    if (value) {
      setDisplayValue(getCarDisplayName(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, owner_id: ownerId || 0 }));
  }, [ownerId]);

  const handleFocus = () => {
    if (!ownerId) {
      showNotification({
        variant: "warning",
        title: "Выберите клиента",
        description: "Сначала необходимо выбрать клиента",
      });
      inputRef.current?.blur();
      return;
    }

    if (!isOpen) {
      loadCars();
      setIsOpen(true);
    }
  };

  const handleInputClick = () => {
    handleFocus();
  };

  const handleSelectCar = (car: Car) => {
    setDisplayValue(getCarDisplayName(car));
    onChange?.(car);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || cars.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < cars.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < cars.length) {
          handleSelectCar(cars[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleOpenAddCarModal = () => {
    if (!ownerId) {
      showNotification({
        variant: "warning",
        title: "Выберите клиента",
        description: "Сначала необходимо выбрать клиента",
      });
      return;
    }

    setFormData({
      brand: "",
      model: "",
      license_plate: "",
      vin: "",
      year: new Date().getFullYear(),
      owner_id: ownerId,
      comment: "",
    });
    openModal();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleOpenAddCarModal();
  };

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

    if (!formData.owner_id || formData.owner_id === 0) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Не указан владелец автомобиля",
      });
      return;
    }

    try {
      const carData: CreateCarData = {
        brand: formData.brand,
        model: formData.model,
        license_plate: formData.license_plate,
        vin: formData.vin || "",
        year: formData.year,
        owner_id: formData.owner_id,
        comment: formData.comment || "",
      };

      const newCar = await carService.createCar(carData);

      showNotification({
        variant: "success",
        title: "Автомобиль создан!",
        description: "Новый автомобиль успешно добавлен",
      });

      const displayName = getCarDisplayName(newCar);
      
      onChange?.(newCar);
      setDisplayValue(displayName);
      closeModal();
      setIsOpen(false);

      // Перезагрузить список авто после создания
      if (ownerId) {
        loadCars();
      }

      setFormData({
        brand: "",
        model: "",
        license_plate: "",
        vin: "",
        year: new Date().getFullYear(),
        owner_id: ownerId || 0,
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

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          readOnly
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onClick={handleInputClick}
          placeholder={ownerId ? placeholder : "Сначала выберите клиента"}
          disabled={!ownerId}
          className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-800"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        {!isLoading && displayValue && ownerId && (
          <button
            type="button"
            onClick={() => {
              setDisplayValue("");
              onChange?.(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {isOpen && ownerId && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Загрузка...</p>
            </div>
          ) : cars.length > 0 ? (
            <>
              <div className="max-h-60 overflow-auto">
                {cars.map((car, index) => (
                  <div
                    key={car.id}
                    onClick={() => handleSelectCar(car)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-800 ${
                      index === highlightedIndex
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800 dark:text-white">
                          {getCarDisplayName(car)}
                        </div>
                        {car.vin && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            VIN: {car.vin}
                          </div>
                        )}
                        {car.year && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Год: {car.year}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="pt-4 px-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Автомобили не найдены
              </div>
            </div>
          )}
          <div className="p-4 text-center">
            <button
              type="button"
              onClick={handleButtonClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
            >
              <SvgIcon name="plus" width={16} />
              Добавить автомобиль
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
            Добавить новый автомобиль
          </h4>
          <form className="space-y-4">
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
              <Label>ID владельца</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.owner_id === 0 ? "" : formData.owner_id}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = value === "" ? 0 : Number(value);
                  setFormData((prev) => ({ ...prev, owner_id: isNaN(numValue) ? 0 : numValue }));
                }}
                disabled
                className="disabled:bg-gray-100 dark:disabled:bg-gray-800"
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
    </div>
  );
}
