import { useState, useEffect, useRef, useCallback } from "react";
import { userService, type CreateUserData } from "../../api/users";
import { contactorService, type CreateContactorData } from "../../api/contactors";
import type { User } from "../../entities/user/model";
import type { Contactor } from "../../entities/contactor/model";
import Label from "./Label";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../context/NotificationContext";
import Input from "./input/InputField";
import SvgIcon from "../../shared/ui/SvgIcon";

type Performer = User | Contactor;

interface PerformerAutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: number | null;
  performerType: "User" | "Contactor";
  onChange?: (performerId: number | null, performer?: Performer | null) => void;
  className?: string;
}

export default function PerformerAutocomplete({
  label,
  placeholder = "Введите имя или номер телефона",
  value,
  performerType,
  onChange,
  className = "",
}: PerformerAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPerformerSelectedRef = useRef(false);
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { showNotification } = useNotification();
  
  // Form data for creating new user
  const [userFormData, setUserFormData] = useState<{
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
  }>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    role: "user",
  });

  const [contactorFormData, setContactorFormData] = useState<CreateContactorData>({
    name: "",
    entity_type: "",
    email: "",
    phone: "",
    inn: "",
    kpp: "",
    legal_address: "",
    contact_person: "",
    bank_name: "",
    bik: "",
    checking_account: "",
    correspondent_account: "",
    service_profile: "",
    active: true,
    comment: "",
  });

  useEffect(() => {
    const loadPerformer = async () => {
      if (value && value > 0) {
        try {
          if (performerType === "User") {
            const searchResults = await userService.searchUsers(value.toString(), 1);
            const performer = searchResults.find(u => u.id === value);
            if (performer) {
              setSelectedPerformer(performer);
              isPerformerSelectedRef.current = true;
              setSearchQuery(performer.full_name || performer.phone || "");
            } else {
              const users = await userService.getUsers();
              const foundPerformer = users.find(u => u.id === value && u.role === "user");
              if (foundPerformer) {
                setSelectedPerformer(foundPerformer);
                isPerformerSelectedRef.current = true;
                setSearchQuery(foundPerformer.full_name || foundPerformer.phone || "");
              }
            }
          } else {
            const contactors = await contactorService.getContactors();
            const foundContactor = contactors.find(c => c.id === value);
            if (foundContactor) {
              setSelectedPerformer(foundContactor);
              isPerformerSelectedRef.current = true;
              setSearchQuery(foundContactor.name || "");
            }
          }
        } catch {
          // Ignore errors
        }
      } else {
        setSelectedPerformer(null);
        setSearchQuery("");
      }
    };

    loadPerformer();
  }, [value, performerType]);

  const searchPerformers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setPerformers([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      if (performerType === "User") {
        const results = await userService.searchUsers(query, 1);
        setPerformers(results);
        setIsOpen(true);
      } else {
        const results = await contactorService.searchContactors(query);
        setPerformers(results);
        setIsOpen(true);
      }
    } catch {
      setPerformers([]);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [performerType]);

  useEffect(() => {
    setPerformers([]);
    setIsOpen(false);
    if (selectedPerformer) {
      setSelectedPerformer(null);
      setSearchQuery("");
    }
  }, [performerType]);

  useEffect(() => {
    if (isPerformerSelectedRef.current) {
      isPerformerSelectedRef.current = false;
      return;
    }

    if (searchQuery.length < 2) {
      setPerformers([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
      searchPerformers(searchQuery);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      setIsLoading(false);
    };
  }, [searchQuery, searchPerformers]);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (!newValue) {
      setSelectedPerformer(null);
      onChange?.(null, null);
    }
  };

  const handleFocus = () => {
    if (searchQuery.length >= 2) {
      setIsOpen(true);
      searchPerformers(searchQuery);
    }
  };

  const handleSelectPerformer = (performer: Performer) => {
    isPerformerSelectedRef.current = true;
    setSelectedPerformer(performer);
    if (performerType === "User") {
      const user = performer as User;
      setSearchQuery(user.full_name || user.phone || "");
    } else {
      const contactor = performer as Contactor;
      setSearchQuery(contactor.name || "");
    }
    onChange?.(performer.id, performer);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || performers.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < performers.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < performers.length) {
          handleSelectPerformer(performers[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const getPerformerDisplayName = (performer: Performer): string => {
    if (performerType === "User") {
      const user = performer as User;
      return user.full_name || user.phone || `ID: ${user.id}`;
    } else {
      const contactor = performer as Contactor;
      return contactor.name || `ID: ${contactor.id}`;
    }
  };

  const handleClearInput = () => {
    setSearchQuery("");
    setSelectedPerformer(null);
    onChange?.(null, null);
    inputRef.current?.focus();
    setIsOpen(false);
  };

  const handleOpenAddModal = () => {
    if (performerType === "User") {
      const queryParts = searchQuery.trim().split(/\s+/);
      setUserFormData({
        first_name: queryParts[0] || "",
        last_name: queryParts.slice(1).join(" ") || "",
        phone: /^[\d\s\+\-\(\)]+$/.test(searchQuery) ? searchQuery : "",
        email: "",
        role: userFormData.role as "user" | "admin" | "manager" | "staff",
      });
    } else {
      setContactorFormData({
        name: searchQuery || "",
        entity_type: "",
        email: "",
        phone: "",
        inn: "",
        kpp: "",
        legal_address: "",
        contact_person: "",
        bank_name: "",
        bik: "",
        checking_account: "",
        correspondent_account: "",
        service_profile: "",
        active: true,
        comment: "",
      });
    }
    openModal();
  };

  const handleCreateUser = async () => {

    if (!userFormData.first_name || !userFormData.phone || !userFormData.email) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Имя, Телефон, Email",
      });
      return;
    }

    try {
      const userData: CreateUserData = {
        first_name: userFormData.first_name,
        last_name: userFormData.last_name || "",
        phone: userFormData.phone,
        email: userFormData.email,
        role: userFormData.role as "user" | "admin" | "manager" | "staff",
        active: true,
        source: "manual",
        password: "",
        position: "other",
      };

      const newUser = await userService.createUser(userData);

      showNotification({
        variant: "success",
        title: "Пользователь создан!",
        description: "Новый пользователь успешно добавлен",
      });

      const displayName = newUser.full_name || newUser.phone;
      
      isPerformerSelectedRef.current = true;
      onChange?.(newUser.id, newUser);
      setSearchQuery(displayName);
      closeModal();
      setIsOpen(false);

      setUserFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        role: userFormData.role as "user" | "admin" | "manager" | "staff",
      });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка создания",
        description: `Не удалось создать пользователя. ${error}`,
      });
    }
  };

  const handleCreateContactor = async () => {

    if (!contactorFormData.name) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательное поле: Название",
      });
      return;
    }

    try {
      const response = await contactorService.createContactor(contactorFormData);
      
      // Handle response - API returns { contactor: {...} }
      const newContactor = (response as any).contactor || response;

      showNotification({
        variant: "success",
        title: "Контрагент создан!",
        description: "Новый контрагент успешно добавлен",
      });

      isPerformerSelectedRef.current = true;
      onChange?.(newContactor.id, newContactor);
      setSearchQuery(newContactor.name);
      closeModal();
      setIsOpen(false);

      setContactorFormData({
        name: "",
        entity_type: "",
        email: "",
        phone: "",
        inn: "",
        kpp: "",
        legal_address: "",
        contact_person: "",
        bank_name: "",
        bik: "",
        checking_account: "",
        correspondent_account: "",
        service_profile: "",
        active: true,
        comment: "",
      });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка создания",
        description: `Не удалось создать контрагента. ${error}`,
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
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
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
        {!isLoading && searchQuery && (
          <button
            type="button"
            onClick={handleClearInput}
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

      {isOpen && performers.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div className="max-h-60 overflow-auto">
            {performers.map((performer, index) => (
              <div
                key={performer.id}
                onClick={() => handleSelectPerformer(performer)}
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
                        {getPerformerDisplayName(performer)}
                      </div>
                      {performerType === "User" && (performer as User).phone && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Телефон: {(performer as User).phone}
                        </div>
                      )}
                      {performerType === "User" && (performer as User).email && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Email: {(performer as User).email}
                        </div>
                      )}
                      {performerType === "Contactor" && (performer as Contactor).entity_type && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Тип: {(performer as Contactor).entity_type}
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && performers.length === 0 && !isLoading && searchQuery.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div className="p-4 text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {performerType === "User" ? "Пользователи" : "Контрагенты"} не найдены
            </div>
            <button
              type="button"
              onClick={() => { handleOpenAddModal(); }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
            >
              <SvgIcon name="plus" width={16} />
              Добавить
            </button>
          </div>
        </div>
      )}

      {/* Modal for creating User */}
      {performerType === "User" && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          className="max-w-[500px] p-6 lg:p-8 sm:m-4 sm:rounded-3xl"
        >
          <div onClick={(e) => e.stopPropagation()}>
            <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
              Добавить пользователя
            </h4>
            <div className="space-y-4">
              <div>
                <Label>Имя *</Label>
                <Input
                  type="text"
                  placeholder="Введите имя"
                  value={userFormData.first_name}
                  onChange={(e) =>
                    setUserFormData((prev) => ({ ...prev, first_name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label>Фамилия</Label>
                <Input
                  type="text"
                  placeholder="Введите фамилию"
                  value={userFormData.last_name}
                  onChange={(e) =>
                    setUserFormData((prev) => ({ ...prev, last_name: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Телефон *</Label>
                <Input
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={userFormData.phone}
                  onChange={(e) =>
                    setUserFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label>Роль</Label>
                <select
                  value={userFormData.role}
                  onChange={(e) =>
                    setUserFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                >
                  <option value="user">Сотрудник</option>
                  <option value="admin">Админ</option>
                  <option value="manager">Менеджер</option>
                  <option value="staff">Персонал</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleCreateUser}
                  className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for creating Contactor */}
      {performerType === "Contactor" && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          className="max-w-3xl p-4 sm:p-6 lg:p-8 sm:m-4 sm:rounded-3xl"
        >
          <div onClick={(e) => e.stopPropagation()} className="overflow-y-auto max-h-[calc(90vh-2rem)]">
            <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
              Добавить нового контрагента
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Название *</Label>
                  <Input
                    type="text"
                    placeholder="Введите название"
                    value={contactorFormData.name}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Тип организации</Label>
                  <select
                    value={contactorFormData.entity_type}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, entity_type: e.target.value }))
                    }
                    className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  >
                    <option value="">Выберите тип</option>
                    <option value="legal">Юридическое лицо</option>
                    <option value="individual">Физическое лицо</option>
                  </select>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    value={contactorFormData.email}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Телефон</Label>
                  <Input
                    type="tel"
                    placeholder="+7 (999) 999-99-99"
                    value={contactorFormData.phone}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>ИНН</Label>
                  <Input
                    type="text"
                    placeholder="Введите ИНН"
                    value={contactorFormData.inn}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, inn: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>КПП</Label>
                  <Input
                    type="text"
                    placeholder="Введите КПП"
                    value={contactorFormData.kpp}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, kpp: e.target.value }))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Юридический адрес</Label>
                  <Input
                    type="text"
                    placeholder="Введите юридический адрес"
                    value={contactorFormData.legal_address}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, legal_address: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Контактное лицо</Label>
                  <Input
                    type="text"
                    placeholder="Введите контактное лицо"
                    value={contactorFormData.contact_person}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, contact_person: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Название банка</Label>
                  <Input
                    type="text"
                    placeholder="Введите название банка"
                    value={contactorFormData.bank_name}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, bank_name: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>БИК</Label>
                  <Input
                    type="text"
                    placeholder="Введите БИК"
                    value={contactorFormData.bik}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, bik: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Расчетный счет</Label>
                  <Input
                    type="text"
                    placeholder="Введите расчетный счет"
                    value={contactorFormData.checking_account}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, checking_account: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Корреспондентский счет</Label>
                  <Input
                    type="text"
                    placeholder="Введите корреспондентский счет"
                    value={contactorFormData.correspondent_account}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, correspondent_account: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Профиль услуг</Label>
                  <Input
                    type="text"
                    placeholder="Введите профиль услуг"
                    value={contactorFormData.service_profile}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, service_profile: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Активен</Label>
                  <div className="flex items-center h-11">
                    <input
                      type="checkbox"
                      checked={contactorFormData.active}
                      onChange={(e) =>
                        setContactorFormData((prev) => ({ ...prev, active: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Да</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label>Комментарий</Label>
                  <textarea
                    className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-24 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    placeholder="Введите комментарий..."
                    value={contactorFormData.comment}
                    onChange={(e) =>
                      setContactorFormData((prev) => ({ ...prev, comment: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleCreateContactor}
                  className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

