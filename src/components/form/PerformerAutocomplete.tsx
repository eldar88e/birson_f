import { useState, useEffect, useRef, useCallback } from "react";
import { userService, type CreateUserData } from "../../api/users";
import { contractorService } from "../../api/contractors";
import type { User } from "../../entities/user/model";
import type { Contractor } from "../../entities/contractor/model";
import Label from "./Label";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../context/NotificationContext";
import Input from "./input/InputField";
import SvgIcon from "../../shared/ui/SvgIcon";
import { positionService } from "../../api/position";
import type { Position } from "../../entities/position/model";
import ContractorModal from "../contractors/ContractorModal";

const DEFAULT_PERFORMER_ROLE = "staff";

type Performer = User | Contractor;

interface PerformerAutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: number | null;
  performerType: "User" | "Contractor";
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
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { showNotification } = useNotification();
  const [isContractorModalOpen, setIsContractorModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState<{
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
    position_id: number;
  }>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    role: DEFAULT_PERFORMER_ROLE,
    position_id: 0,
  });

  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  const [positionSearch, setPositionSearch] = useState("");
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [isCreatingPosition, setIsCreatingPosition] = useState(false);
  const positionWrapperRef = useRef<HTMLDivElement>(null);

  const loadPositions = () => {
    if (positions.length > 0 || isLoadingPositions) return;
    setIsLoadingPositions(true);
    positionService.getPositions()
      .then((data) => {
        setPositions(data.data);
      })
      .catch((error) => {
        console.error("Failed to load positions:", error);
      })
      .finally(() => {
        setIsLoadingPositions(false);
      });
  };

  const filteredPositions = positions.filter((p) =>
    p.title.toLowerCase().includes(positionSearch.toLowerCase())
  );

  const positionExactMatch = positions.some(
    (p) => p.title.toLowerCase() === positionSearch.trim().toLowerCase()
  );

  const handleSelectPosition = (position: Position) => {
    setUserFormData((prev) => ({ ...prev, position_id: position.id }));
    setPositionSearch(position.title);
    setIsPositionDropdownOpen(false);
  };

  const handleCreatePosition = async () => {
    const title = positionSearch.trim();
    if (!title) return;

    setIsCreatingPosition(true);
    try {
      const newPosition = await positionService.createPosition({ title });
      setPositions((prev) => [newPosition, ...prev]);
      setUserFormData((prev) => ({ ...prev, position_id: newPosition.id }));
      setPositionSearch(newPosition.title);
      setIsPositionDropdownOpen(false);
      showNotification({
        variant: "success",
        title: "Должность создана!",
      });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка",
        description: `Не удалось создать должность. ${error}`,
      });
    } finally {
      setIsCreatingPosition(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (positionWrapperRef.current && !positionWrapperRef.current.contains(event.target as Node)) {
        setIsPositionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadPerformer = async () => {
      if (value && value > 0) {
        try {
          if (performerType === "User") {
            const searchResults = await userService.searchUsers(value.toString(), 1);
            const performer = searchResults.find(u => u.id === value);
            if (performer) {
              setSelectedPerformer(performer);
              setInputValue(performer.full_name || performer.phone || "");
              setSearchQuery("");
            } else {
              const users = await userService.getUsers();
              const foundPerformer = users.find(u => u.id === value && u.role === "user");
              if (foundPerformer) {
                setSelectedPerformer(foundPerformer);
                setInputValue(foundPerformer.full_name || foundPerformer.phone || "");
                setSearchQuery("");
              }
            }
          } else {
            const response = await contractorService.getContractors();
            const contractors = response.data;
            const foundContractor = contractors.find((c: Contractor) => c.id === value);
            if (foundContractor) {
              setSelectedPerformer(foundContractor);
              setInputValue(foundContractor.name || "");
              setSearchQuery("");
            }
          }
        } catch {
          // Ignore errors
        }
      } else {
        setSelectedPerformer(null);
        setInputValue("");
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
        const results = await contractorService.searchContractors(query);
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
      setInputValue("");
      setSearchQuery("");
    }
  }, [performerType]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setPerformers([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }
  
    const debounceTimer = setTimeout(() => {
      searchPerformers(searchQuery);
    }, 300);
  
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchPerformers]);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);
    setSearchQuery(value);

    if (!value) {
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
    setSelectedPerformer(performer);

    const displayName =
      performerType === "User"
        ? (performer as User).full_name || (performer as User).phone
        : (performer as Contractor).name;

    setInputValue(displayName);
    setSearchQuery("");

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
      const contractor = performer as Contractor;
      return contractor.name || `ID: ${contractor.id}`;
    }
  };

  const handleClearInput = () => {
    setInputValue("");
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
        role: DEFAULT_PERFORMER_ROLE,
        position_id: 0,
      });
      setPositionSearch("");
      setIsPositionDropdownOpen(false);
      openModal();
    } else {
      setIsContractorModalOpen(true);
    }
  };

  const handleCreateUser = async () => {

    if (!userFormData.first_name || !userFormData.phone || !userFormData.position_id) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Заполните обязательные поля: Имя, Телефон, Должность",
      });
      return;
    }

    try {
      const userData: CreateUserData = {
        first_name: userFormData.first_name,
        last_name: userFormData.last_name || "",
        phone: userFormData.phone,
        email: userFormData.email,
        role: userFormData.role as User["role"],
        active: true,
        source: "manual",
        password: "",
        position_id: userFormData.position_id,
      };

      const newUser = await userService.createUser(userData);

      showNotification({
        variant: "success",
        title: "Пользователь создан!",
        description: "Новый пользователь успешно добавлен",
      });

      const displayName = newUser.full_name || newUser.phone;

      onChange?.(newUser.id, newUser);
      setInputValue(displayName);
      setSearchQuery("");
      setPositionSearch("");
      setIsPositionDropdownOpen(false);
      closeModal();
      setIsOpen(false);

      setUserFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        role: DEFAULT_PERFORMER_ROLE,
        position_id: 0,
      });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка создания",
        description: `Не удалось создать пользователя. ${error}`,
      });
    }
  };

  const handleContractorCreated = (newContractor: Contractor) => {
    onChange?.(newContractor.id, newContractor);
    setInputValue(newContractor.name);
    setSearchQuery("");
    setIsContractorModalOpen(false);
    setIsOpen(false);
  };


  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
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
                      {performerType === "Contractor" && (performer as Contractor).entity_type && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Тип: {(performer as Contractor).entity_type}
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
              Добавить сотрудника
            </h4>
            <div className="space-y-4">
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
                <Label>Должность *</Label>
                <div className="relative" ref={positionWrapperRef}>
                  <input
                    type="text"
                    value={positionSearch}
                    onChange={(e) => {
                      setPositionSearch(e.target.value);
                      setIsPositionDropdownOpen(true);
                      if (!e.target.value) {
                        setUserFormData((prev) => ({ ...prev, position_id: 0 }));
                      }
                    }}
                    onFocus={() => { loadPositions(); setIsPositionDropdownOpen(true); }}
                    placeholder="Введите должность"
                    className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                  {isLoadingPositions && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  )}
                  {!isLoadingPositions && positionSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setPositionSearch("");
                        setUserFormData((prev) => ({ ...prev, position_id: 0 }));
                        setIsPositionDropdownOpen(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}

                  {isPositionDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                      {filteredPositions.length > 0 && (
                        <div className="max-h-40 overflow-auto">
                          {filteredPositions.map((position) => (
                            <div
                              key={position.id}
                              onClick={() => handleSelectPosition(position)}
                              className="px-4 py-2.5 cursor-pointer text-sm text-gray-800 hover:bg-gray-100 dark:text-white/90 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                            >
                              {position.title}
                            </div>
                          ))}
                        </div>
                      )}

                      {positionSearch.trim() && !positionExactMatch && (
                        <div className="border-t border-gray-100 dark:border-gray-800">
                          <button
                            type="button"
                            onClick={handleCreatePosition}
                            disabled={isCreatingPosition}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/20 disabled:opacity-50"
                          >
                            <SvgIcon name="plus" width={16} />
                            {isCreatingPosition ? "Создание..." : `Создать "${positionSearch.trim()}"`}
                          </button>
                        </div>
                      )}

                      {filteredPositions.length === 0 && !positionSearch.trim() && (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                          Начните вводить название
                        </div>
                      )}
                    </div>
                  )}
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

      {performerType === "Contractor" && (
        <ContractorModal
          isModalOpen={isContractorModalOpen}
          onClose={() => setIsContractorModalOpen(false)}
          onSuccess={handleContractorCreated}
          initialData={searchQuery ? { name: searchQuery } : undefined}
        />
      )}
    </div>
  );
}
