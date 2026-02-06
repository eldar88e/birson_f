import { useState, useEffect, useRef } from "react";
import { serviceService } from "../../api/services";
import type { Service } from "../../entities/service/model";
import Label from "./Label";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useNotification } from "../../context/NotificationContext";
import SvgIcon from "../../shared/ui/SvgIcon";

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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isServiceSelectedRef = useRef(false);
  const { showNotification } = useNotification();
  const [servicesLoaded, setServicesLoaded] = useState(false);

  const loadServices = async () => {
    if (servicesLoaded || isLoading) return;

    setIsLoading(true);
    try {
      const response = await serviceService.getServices();
      setServices(response.data);
      setServicesLoaded(true);
    } catch {
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
  }, [value, services]);

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exactMatch = services.some(
    (s) => s.title.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  useClickOutside(wrapperRef, () => {
    if (!isServiceSelectedRef.current) {
      setIsOpen(false);
      setSearchQuery(selectedService?.title || "");
    }
    isServiceSelectedRef.current = false;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
    const title = searchQuery.trim();
    if (!title) return;

    setIsCreating(true);
    try {
      const newService = await serviceService.createService({ title });
      setServices((prev) => [newService, ...prev]);
      setSelectedService(newService);
      setSearchQuery(newService.title);
      isServiceSelectedRef.current = true;
      onChange?.(newService.id, newService);
      setIsOpen(false);
      showNotification({
        variant: "success",
        title: "Услуга создана!",
      });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка",
        description: `Не удалось создать услугу. ${error}`,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedService(null);
    onChange?.(null, null);
    inputRef.current?.focus();
    setIsOpen(false);
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
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
        {!isLoading && searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {!isLoading && !searchQuery && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {isLoading ? (
            <div className="px-4 py-3 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500" />
            </div>
          ) : (
            <>
              {filteredServices.length > 0 && (
                <div className="max-h-48 overflow-auto">
                  {filteredServices.map((service, index) => (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`cursor-pointer px-4 py-2.5 text-sm border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                        index === highlightedIndex
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "text-gray-800 hover:bg-gray-50 dark:text-white/90 dark:hover:bg-gray-800"
                      }`}
                    >
                      {service.title}
                    </div>
                  ))}
                </div>
              )}

              {searchQuery.trim() && !exactMatch && (
                <div className="border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleCreateService}
                    disabled={isCreating}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/20 disabled:opacity-50"
                  >
                    <SvgIcon name="plus" width={16} />
                    {isCreating ? "Создание..." : `Создать "${searchQuery.trim()}"`}
                  </button>
                </div>
              )}

              {filteredServices.length === 0 && !searchQuery.trim() && (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Начните вводить название
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
