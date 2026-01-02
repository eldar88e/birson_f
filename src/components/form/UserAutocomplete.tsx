import { useState, useEffect, useRef } from "react";
import { userService } from "../../api/users";
import type { User } from "../../entities/user/model";
import Label from "./Label";

interface UserAutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: User | null;
  onChange?: (user: User | null) => void;
  className?: string;
}

export default function UserAutocomplete({
  label,
  placeholder = "Введите имя или номер телефона",
  value,
  onChange,
  className = "",
}: UserAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setSearchQuery(value.full_name || `${value.first_name} ${value.last_name || ""}`.trim() || value.phone);
    } else {
      setSearchQuery("");
    }
  }, [value]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setUsers([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Делаем запрос к API при вводе текста
    const searchUsers = async () => {
      try {
        const results = await userService.searchUsers(searchQuery);
        setUsers(results);
        setIsOpen(results.length > 0);
      } catch (error) {
        console.error("Error searching users:", error);
        setUsers([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Используем debounce для плавности
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
    setSearchQuery(
      user.full_name ||
        `${user.first_name} ${user.last_name || ""}`.trim() ||
        user.phone
    );
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
    if (user.full_name) return user.full_name;
    const name = `${user.first_name} ${user.last_name || ""}`.trim();
    return name || user.phone;
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
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (users.length > 0) setIsOpen(true);
          }}
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

      {isOpen && users.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700 max-h-60 overflow-auto">
          {users.map((user, index) => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
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
      )}

      {isOpen && searchQuery.length >= 2 && !isLoading && users.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Пользователи не найдены
          </div>
        </div>
      )}
    </div>
  );
}

