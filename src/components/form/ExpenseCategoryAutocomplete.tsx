import { useState, useEffect, useRef } from "react";
import { expenseCategoryService } from "../../api/expense-categories";
import type { ExpenseCategory } from "../../entities/expense-category/model";
import Label from "./Label";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useNotification } from "../../context/NotificationContext";
import ExpenseCategoryModal from "../expense-categories/ExpenseCategoryModal";

interface ExpenseCategoryAutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: number | null;
  onChange?: (categoryId: number | null, category?: ExpenseCategory | null) => void;
  className?: string;
  required?: boolean;
  onCategoryModalOpenChange?: (isOpen: boolean) => void;
}

export default function ExpenseCategoryAutocomplete({
  label,
  placeholder = "Введите название категории",
  value,
  onChange,
  className = "",
  required = false,
  onCategoryModalOpenChange,
}: ExpenseCategoryAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ExpenseCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { showNotification } = useNotification();
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const loadCategories = async () => {
    if (categoriesLoaded) return;

    setIsLoading(true);
    try {
      const response = await expenseCategoryService.getList();
      const loadedCategories = response.data;
      setCategories(loadedCategories);
      setFilteredCategories(loadedCategories);
      setCategoriesLoaded(true);
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Ошибка загрузки",
        description: "Не удалось загрузить список категорий расходов",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (value && value > 0 && !categoriesLoaded && !isLoading) {
      loadCategories();
    }
  }, [value, categoriesLoaded, isLoading]);

  useEffect(() => {
    if (!value) {
      setSelectedCategory(null);
      setSearchQuery("");
      return;
    }

    if (!categoriesLoaded) return;

    const syncCategory = async () => {
      if (selectedCategory?.id === value) return;

      const found = categories.find((c) => c.id === value);
      if (found) {
        setSelectedCategory(found);
        setSearchQuery(found.title);
        return;
      }

      try {
        const category = await expenseCategoryService.getById(value);
        if (category) {
          setCategories((prev) =>
            prev.some((c) => c.id === category.id)
              ? prev
              : [...prev, category]
          );
          setSelectedCategory(category);
          setSearchQuery(category.title);
        }
      } catch {
        setSelectedCategory(null);
        setSearchQuery("");
      }
    };

    syncCategory();
  }, [value, categories, categoriesLoaded, selectedCategory]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = categories.filter(
      (category) => category.title.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  useClickOutside(wrapperRef, () => {
    setIsOpen(false);
    if (selectedCategory) {
      setSearchQuery(selectedCategory.title);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (selectedCategory && newQuery !== selectedCategory.title) {
      setSelectedCategory(null);
      onChange?.(null, null);
    }
  };

  const handleInputFocus = () => {
    loadCategories();
    setIsOpen(true);
  };

  const handleSelectCategory = (category: ExpenseCategory) => {
    setSelectedCategory(category);
    setSearchQuery(category.title);
    setIsOpen(false);
    onChange?.(category.id ?? null, category);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredCategories.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCategories.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCategories.length) {
          handleSelectCategory(filteredCategories[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleCategoryCreated = async (newCategory: ExpenseCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setFilteredCategories((prev) => [...prev, newCategory]);

    setSelectedCategory(newCategory);
    setSearchQuery(newCategory.title);

    onChange?.(newCategory.id ?? null, newCategory);

    setIsCategoryModalOpen(false);
    onCategoryModalOpenChange?.(false);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && <Label htmlFor="expense-category-autocomplete">{label}{required && " *"}</Label>}
      <div className="relative">
        <input
          ref={inputRef}
          id="expense-category-autocomplete"
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
        />
        {isLoading ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 animate-spin text-gray-400"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : selectedCategory || searchQuery ? (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
              setIsOpen(false);
              onChange?.(null, null);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Очистить категорию"
          >
            <svg
              width="16"
              height="16"
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
        ) : (
          <button
            type="button"
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
                return;
              }
              loadCategories();
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={isOpen ? "Закрыть список категорий" : "Открыть список категорий"}
          >
            <svg
              className="h-5 w-5"
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
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {isLoading ? (
            <div className="px-4 py-2 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              Категории не найдены
            </div>
          ) : (
            <>
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  onClick={() => handleSelectCategory(category)}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    index === highlightedIndex
                      ? "bg-brand-50 text-brand-900 dark:bg-brand-900/20 dark:text-brand-300"
                      : "text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="font-medium">{category.title}</div>
                  {category.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {category.description}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setIsCategoryModalOpen(true);
                onCategoryModalOpenChange?.(true);
              }}
              className="w-full px-4 py-2 text-left text-sm text-brand-600 hover:bg-gray-50 dark:text-brand-400 dark:hover:bg-gray-700"
            >
              + Добавить новую категорию
            </button>
          </div>
        </div>
      )}

      <ExpenseCategoryModal
        isModalOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          onCategoryModalOpenChange?.(false);
        }}
        expenseCategory={null}
        onSuccess={handleCategoryCreated}
      />
    </div>
  );
}
