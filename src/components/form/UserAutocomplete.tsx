import { useState, useEffect, useRef } from "react";
import { userService, type CreateUserData } from "../../api/users";
import { USER_ROLES, type User } from "../../entities/user/model";
import Label from "./Label";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../context/NotificationContext";
import Input from "./input/InputField";
import SvgIcon from "../../shared/ui/SvgIcon";

const DEFAULT_USER_ROLE = "user";

interface UserAutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: User | null;
  onChange?: (user: User | null) => void;
  disabled?: boolean;
}

export default function UserAutocomplete({
  label,
  placeholder = "Введите имя или номер телефона",
  value,
  onChange,
  disabled = false
}: UserAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isUserSelectedRef = useRef(false);
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<{
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
    role: DEFAULT_USER_ROLE,
  });

  useEffect(() => {
    if (value) {
      isUserSelectedRef.current = true;
      const displayName = value.full_name || value.phone || value.email || "";
      setSearchQuery(displayName);
    } else {
      setSearchQuery("");
    }
  }, [value]);

  useEffect(() => {
    if (isUserSelectedRef.current) {
      isUserSelectedRef.current = false;
      return;
    }

    if (!searchQuery || searchQuery.length < 2) {
      setUsers([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const searchUsers = async () => {
      try {
        const results = await userService.searchUsers(searchQuery);
        setUsers(results);
        setIsOpen(true);
      } catch {
        setUsers([]);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);

    return () => {
      clearTimeout(debounceTimer);
      setIsLoading(false);
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (!newValue) {
      onChange?.(null);
    }
  };

  const handleSelectUser = (user: User) => {
    isUserSelectedRef.current = true;
    setSearchQuery(user.full_name || user.phone || user.email || "");
    onChange?.(user);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || users.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < users.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < users.length) {
          handleSelectUser(users[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const getUserDisplayName = (user: User): string => {
    return user.full_name || user.phone || user.email || "";
  };

  const handleOpenAddUserModal = () => {
    const query = searchQuery || "";
    const queryParts = query.trim().split(/\s+/);
    setFormData({
      first_name: queryParts[0] || "",
      last_name: queryParts.slice(1).join(" ") || "",
      phone: /^[\d\s\+\-\(\)]+$/.test(query) ? query : "",
      email: "",
      role: DEFAULT_USER_ROLE,
    });
    openModal();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleOpenAddUserModal();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.phone) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Имя, Email",
      });
      return;
    }

    try {
      const userData: CreateUserData = {
        first_name: formData.first_name,
        last_name: formData.last_name || "",
        phone: formData.phone,
        email: formData.email,
        role: "user",
        active: true,
        source: "manual",
        password: ""
      };

      const newUser = await userService.createUser(userData);

      showNotification({
        variant: "success",
        title: "Пользователь создан!",
        description: "Новый пользователь успешно добавлен",
      });

      const displayName = newUser.full_name || newUser.phone || newUser.email || "";
      
      isUserSelectedRef.current = true;
      onChange?.(newUser);
      setSearchQuery(displayName);
      closeModal();
      setIsOpen(false);

      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        role: DEFAULT_USER_ROLE,
      });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка создания",
        description: `Не удалось создать пользователя. ${error}`,
      });
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchQuery && searchQuery.length >= 2 && !disabled) {
              setIsOpen(true);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (searchQuery && searchQuery.length >= 2 && users.length > 0 && !disabled) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
            onClick={() => {
              setSearchQuery("");
              onChange?.(null);
              inputRef.current?.focus();
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

      {isOpen && searchQuery && searchQuery.length >= 2 && (
        <div 
          className="absolute z-[10] w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Поиск...</p>
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="max-h-60 overflow-auto">
                {users.map((user, index) => (
                  <div
                    key={user.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectUser(user);
                    }}
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
                          {getUserDisplayName(user)}
                        </div>
                        {user.phone && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {user.phone}
                          </div>
                        )}
                        {user.email && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
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
                Пользователи не найдены
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
              Добавить пользователя
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
            Добавить нового клиента
          </h4>
          <form className="space-y-4">
          <div>
            <Label>Имя *</Label>
            <Input
              type="text"
              placeholder="Введите имя"
              value={formData.first_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, first_name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label>Фамилия</Label>
            <Input
              type="text"
              placeholder="Введите фамилию"
              value={formData.last_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, last_name: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Телефон *</Label>
            <Input
              type="tel"
              placeholder="+7 (999) 999-99-99"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label>Роль *</Label>
            <select
              value={formData.role}
              className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              {USER_ROLES.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
          
            <button
              type="button"
              onClick={handleCreateUser}
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

