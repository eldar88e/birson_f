import { useState, useEffect, useRef } from "react";
import { serviceService, type CreateServiceData } from "../../api/services";
import type { Service } from "../../entities/service/model";
import Label from "./Label";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../context/NotificationContext";
import Input from "./input/InputField";
import Button from "../ui/button/Button";

interface ServiceAutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: number | null;
  onChange?: (serviceId: number | null, service?: Service | null) => void;
  className?: string;
}

export default function ServiceAutocomplete({
  label,
  placeholder = "Введите название услуги",
  value,
  onChange,
  className = "",
}: ServiceAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isServiceSelectedRef = useRef(false);
  const skipFilterRef = useRef(false);
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { showNotification } = useNotification();

  const [serviceFormData, setServiceFormData] = useState<CreateServiceData>({
    title: "",
  });
  const [servicesLoaded, setServicesLoaded] = useState(false);

  const loadServices = async () => {
    if (servicesLoaded) return;
    
    setIsLoading(true);
    try {
      const loadedServices = await serviceService.getServices();
      setServices(loadedServices);
      setFilteredServices(loadedServices);
      setServicesLoaded(true);
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка загрузки",
        description: "Не удалось загрузить список услуг",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadSelectedService = async () => {
      if (value && value > 0 && services.length > 0) {
        const foundService = services.find((s) => s.id === value);
        if (foundService) {
          setSelectedService(foundService);
          isServiceSelectedRef.current = true;
          setSearchQuery(foundService.title);
        }
      } else if (!value) {
        setSelectedService(null);
        isServiceSelectedRef.current = false;
        setSearchQuery("");
      }
    };

    loadSelectedService();
  }, [value, services]);

  useEffect(() => {
    if (skipFilterRef.current) {
      skipFilterRef.current = false;
      return;
    }

    if (!searchQuery.trim()) {
      setFilteredServices(services);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = services.filter(
      (service) => service.title.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  useClickOutside(wrapperRef, () => {
    if (!isServiceSelectedRef.current) {
      setIsOpen(false);
      setSearchQuery(selectedService?.title || "");
    }
    isServiceSelectedRef.current = false;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    setIsOpen(true);
    isServiceSelectedRef.current = false;
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    loadServices();
    setIsOpen(true);
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setSearchQuery(service.title);
    setIsOpen(false);
    isServiceSelectedRef.current = true;
    onChange?.(service.id, service);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredServices.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredServices.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredServices.length) {
          handleSelectService(filteredServices[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleCreateService = async () => {
    if (!serviceFormData.title.trim()) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Название услуги обязательно",
      });
      return;
    }

    try {
      const newService = await serviceService.createService(serviceFormData);

      showNotification({
        variant: "success",
        title: "Услуга создана!",
        description: "Новая услуга успешно добавлена",
      });

      const updatedServices = [...services, newService];
      setServices(updatedServices);
      setFilteredServices(updatedServices);

      skipFilterRef.current = true;

      setSelectedService(newService);
      setSearchQuery(newService.title);

      isServiceSelectedRef.current = true;
      onChange?.(newService.id, newService);
      closeModal();
      setIsOpen(false);
      setServiceFormData({ title: "" });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка создания",
        description: `Не удалось создать услугу. ${error}`,
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
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {isLoading ? (
            <div className="px-4 py-2 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              Услуги не найдены
            </div>
          ) : (
            <>
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    index === highlightedIndex
                      ? "bg-brand-50 text-brand-900 dark:bg-brand-900/20 dark:text-brand-300"
                      : "text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="font-medium">{service.title}</div>
                </div>
              ))}
            </>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={openModal}
              className="w-full px-4 py-2 text-left text-sm text-brand-600 hover:bg-gray-50 dark:text-brand-400 dark:hover:bg-gray-700"
            >
              + Добавить новую услугу
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-2xl p-4 sm:p-6 lg:p-8 sm:m-4 sm:rounded-3xl"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
            Добавить новую услугу
          </h4>
          <div className="space-y-4">
            <div>
              <Label>Название услуги *</Label>
              <Input
                type="text"
                placeholder="Введите название услуги"
                value={serviceFormData.title}
                onChange={(e) =>
                  setServiceFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={closeModal}>
                Отмена
              </Button>
              <Button type="button" variant="primary" onClick={handleCreateService}>
                Добавить
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
