import { useState, useEffect, useRef } from "react";
import type { Car } from "../../entities/car/model";
import Label from "./Label";
import { useCarSearch } from "../../hooks/useCarSearch";
import { useClickOutside } from "../../hooks/useClickOutside";
import CarModal from "../cars/CarModal";

interface CarAutocompleteProps {
  value?: Car | null;
  onChange?: (car: Car | null) => void;
  ownerId: number;
}

export default function CarAutocomplete({
  value,
  onChange,
  ownerId,
}: CarAutocompleteProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { cars, isLoading, loadCars } = useCarSearch(ownerId);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const getCarDisplayName = (car: Car): string => {
    return [car.brand, car.model, car.year].filter(Boolean).join(" ");
  };

  useEffect(() => {
    if (value) {
      setDisplayValue(getCarDisplayName(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleFocus = () => {
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

  return (
    <div className="relative" ref={wrapperRef}>
      <Label>Автомобиль</Label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          readOnly
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onClick={handleInputClick}
          placeholder="Нажмите для выбора автомобиля"
          className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
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

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          {!ownerId || ownerId === 0 ? (
            <div className="pt-4 px-4 pb-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Выберите клиента для загрузки автомобилей
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Загрузка...</p>
                </div>
              ) : cars.length > 0 ? (
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
                          <div className="text-sm text-gray-800 dark:text-white">
                            {getCarDisplayName(car)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pt-4 px-4 text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Автомобили не найдены
                  </div>
                </div>
              )}
              <div className="">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(true)}
                  className="w-full px-4 py-2 text-left text-sm text-brand-600 hover:bg-gray-50 dark:text-brand-400 dark:hover:bg-gray-700"
                >
                  + Добавить автомобиль
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <CarModal isModalOpen={isOpenModal} ownerId={ownerId} onClose={() => setIsOpenModal(false)} />
    </div>
  );
}
