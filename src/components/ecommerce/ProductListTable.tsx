import React, { useState } from "react";
import { Link } from "react-router";
import Button from "../ui/button/Button";
import TableDropdown from "../common/TableDropdown";
import SvgIcon from "../../shared/ui/SvgIcon";
import Pages from "../../shared/ui/Pages";
import { ROUTES } from "../../shared/config/routes";

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  brand: string;
  price: string;
  stock: string;
  createdAt: string;
}

interface Sort {
  key: keyof Product;
  asc: boolean;
}

const FilterDropdown: React.FC<{
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
}> = ({ showFilter, setShowFilter }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setShowFilter]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        onClick={() => setShowFilter(!showFilter)}
        type="button"
      >
        <SvgIcon name="filter" />
        Filter
      </button>
      {showFilter && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <input
              type="text"
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Search category..."
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Customer
            </label>
            <input
              type="text"
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Search customer..."
            />
          </div>
          <button className="bg-brand-500 hover:bg-brand-600 h-10 w-full rounded-lg px-3 py-2 text-sm font-medium text-white">
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

const ProductListTable: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Macbook pro M4",
      image: "/images/product/product-01.jpg",
      category: "Laptop",
      brand: "Apple",
      price: "$699",
      stock: "In Stock",
      createdAt: "12 Feb, 2027",
    },
    {
      id: 2,
      name: "Apple Watch Ultra",
      image: "/images/product/product-02.jpg",
      category: "Watch",
      brand: "Apple",
      price: "$1,579",
      stock: "Out of Stock",
      createdAt: "13 Mar, 2027",
    },
    {
      id: 3,
      name: "iPhone 15 Pro Max",
      image: "/images/product/product-03.jpg",
      category: "Phone",
      brand: "Apple",
      price: "$1,039",
      stock: "In Stock",
      createdAt: "19 Mar, 2027",
    },
    {
      id: 4,
      name: "iPad Pro 3rd Gen",
      image: "/images/product/product-04.jpg",
      category: "Electronics",
      brand: "Apple",
      price: "$43,999",
      stock: "In Stock",
      createdAt: "25 Apr, 2027",
    },
    {
      id: 5,
      name: "Samsung Galaxy S24 Ultra",
      image: "/images/product/product-05.jpg",
      category: "Phone",
      brand: "Samsung",
      price: "$699",
      stock: "In Stock",
      createdAt: "11 May, 2027",
    },
    {
      id: 6,
      name: "Airpods Pro 2nd Gen",
      image: "/images/product/product-01.jpg",
      category: "Accessories",
      brand: "Apple",
      price: "$839",
      stock: "In Stock",
      createdAt: "29 Jun, 2027",
    },
    {
      id: 7,
      name: "LG OLED & 4K Smart TV",
      image: "/images/product/product-02.jpg",
      category: "Electronics",
      brand: "LG",
      price: "$1,769",
      stock: "Out of Stock",
      createdAt: "22 Jul, 2027",
    },
    {
      id: 8,
      name: "Sony WH-1000XM5 Headphones",
      image: "/images/product/product-03.jpg",
      category: "Audio",
      brand: "Sony",
      price: "$399",
      stock: "In Stock",
      createdAt: "05 Aug, 2027",
    },
    {
      id: 9,
      name: "Dell XPS 13 Laptop",
      image: "/images/product/product-04.jpg",
      category: "Laptop",
      brand: "Dell",
      price: "$1,299",
      stock: "In Stock",
      createdAt: "18 Aug, 2027",
    },
    {
      id: 10,
      name: "Google Pixel 8 Pro",
      image: "/images/product/product-05.jpg",
      category: "Phone",
      brand: "Google",
      price: "$899",
      stock: "Out of Stock",
      createdAt: "02 Sep, 2027",
    },
    {
      id: 11,
      name: "Microsoft Surface Pro 9",
      image: "/images/product/product-02.jpg",
      category: "Tablet",
      brand: "Microsoft",
      price: "$1,099",
      stock: "In Stock",
      createdAt: "15 Sep, 2027",
    },
    {
      id: 12,
      name: "Canon EOS R5 Camera",
      image: "/images/product/product-03.jpg",
      category: "Camera",
      brand: "Canon",
      price: "$3,899",
      stock: "In Stock",
      createdAt: "28 Sep, 2027",
    },
    {
      id: 13,
      name: "Nintendo Switch OLED",
      image: "/images/product/product-04.jpg",
      category: "Gaming",
      brand: "Nintendo",
      price: "$349",
      stock: "Out of Stock",
      createdAt: "10 Oct, 2027",
    },
    {
      id: 14,
      name: "Razer DeathAdder V3 Mouse",
      image: "/images/product/product-05.jpg",
      category: "Accessories",
      brand: "Razer",
      price: "$89",
      stock: "In Stock",
      createdAt: "23 Oct, 2027",
    },
    {
      id: 15,
      name: "HP Envy 34 Monitor",
      image: "/images/product/product-01.jpg",
      category: "Monitor",
      brand: "HP",
      price: "$799",
      stock: "In Stock",
      createdAt: "05 Nov, 2027",
    },
    {
      id: 16,
      name: "Bose QuietComfort Earbuds",
      image: "/images/product/product-02.jpg",
      category: "Audio",
      brand: "Bose",
      price: "$279",
      stock: "In Stock",
      createdAt: "18 Nov, 2027",
    },
    {
      id: 17,
      name: "ASUS ROG Gaming Laptop",
      image: "/images/product/product-03.jpg",
      category: "Laptop",
      brand: "ASUS",
      price: "$2,199",
      stock: "Out of Stock",
      createdAt: "01 Dec, 2027",
    },
    {
      id: 18,
      name: "Logitech MX Master 3S",
      image: "/images/product/product-04.jpg",
      category: "Accessories",
      brand: "Logitech",
      price: "$119",
      stock: "In Stock",
      createdAt: "14 Dec, 2027",
    },
    {
      id: 19,
      name: "Steam Deck OLED",
      image: "/images/product/product-05.jpg",
      category: "Gaming",
      brand: "Valve",
      price: "$649",
      stock: "In Stock",
      createdAt: "27 Dec, 2027",
    },
    {
      id: 20,
      name: "Samsung 980 Pro SSD 2TB",
      image: "/images/product/product-01.jpg",
      category: "Storage",
      brand: "Samsung",
      price: "$299",
      stock: "In Stock",
      createdAt: "09 Jan, 2028",
    },
  ]);
  const [selected, setSelected] = useState<number[]>([]);
  const [sort, setSort] = useState<Sort>({ key: "name", asc: true });
  const [page, setPage] = useState(1);
  const [perPage] = useState(7);
  const [showFilter, setShowFilter] = useState(false);

  const sortedProducts = () => {
    return [...products].sort((a, b) => {
      let valA = a[sort.key];
      let valB = b[sort.key];
      if (sort.key === "price") {
        valA = parseFloat(String(valA).replace(/[^\d.]/g, ""));
        valB = parseFloat(String(valB).replace(/[^\d.]/g, ""));
      }
      if (valA < valB) return sort.asc ? -1 : 1;
      if (valA > valB) return sort.asc ? 1 : -1;
      return 0;
    });
  };

  const paginatedProducts = () => {
    const start = (page - 1) * perPage;
    return sortedProducts().slice(start, start + perPage);
  };

  const totalPages = () => Math.ceil(products.length / perPage);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const ids = paginatedProducts().map((p) => p.id);
    setSelected((prev) =>
      isAllSelected()
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])]
    );
  };

  const isAllSelected = () => {
    const ids = paginatedProducts().map((p) => p.id);
    return ids.length > 0 && ids.every((id) => selected.includes(id));
  };

  const startItem = () => {
    return products.length === 0 ? 0 : (page - 1) * perPage + 1;
  };

  const endItem = () => {
    return Math.min(page * perPage, products.length);
  };

  const sortBy = (key: keyof Product) => {
    setSort((prev) => ({
      key,
      asc: prev.key === key ? !prev.asc : true,
    }));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Products List
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your store's progress to boost your sales.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            Export
            <SvgIcon name="download" />
          </Button>
          <Link
            to={ROUTES.PRODUCTS.ADD_PRODUCT}
            className="bg-brand-500 shadow-sm hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            <SvgIcon name="plus" />
            Добавить
          </Link>
        </div>
      </div>
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="flex gap-3 sm:justify-between">
          <div className="relative flex-1 sm:flex-auto">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <SvgIcon name="search" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>
          <FilterDropdown
            showFilter={showFilter}
            setShowFilter={setShowFilter}
          />
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              <th className="lg:w-14 px-5 py-4 text-left whitespace-nowrap">
                <label className="cursor-pointer text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="sr-only"
                    onChange={toggleAll}
                    checked={isAllSelected()}
                  />
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                      isAllSelected()
                        ? "border-brand-500 bg-brand-500"
                        : "bg-transparent border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    <span className={isAllSelected() ? "" : "opacity-0"}>
                      <SvgIcon name="check" />
                    </span>
                  </span>
                </label>
              </th>
              <th
                onClick={() => sortBy("name")}
                className="cursor-pointer px-5 whitespace-nowrap py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Products
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.key === "name" && sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className={
                        sort.key === "name" && !sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </th>
              <th
                onClick={() => sortBy("category")}
                className="cursor-pointer px-5 py-4 whitespace-nowrap text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.key === "category" && sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className={
                        sort.key === "category" && !sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </th>
              <th
                onClick={() => sortBy("brand")}
                className="cursor-pointer px-5 py-4 whitespace-nowrap text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Brand
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.key === "brand" && sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className={
                        sort.key === "brand" && !sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </th>
              <th
                onClick={() => sortBy("price")}
                className="cursor-pointer px-5 whitespace-nowrap py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Price
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.key === "price" && sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className={
                        sort.key === "price" && !sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </th>
              <th className="px-5 py-4 text-left whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">
                Stock
              </th>
              <th className="px-5 py-4 text-left whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">
                Created At
              </th>
              <th className="px-5 py-4 text-left whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="relative">
                  <span className="sr-only">Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-x divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedProducts().map((product) => (
              <tr
                key={product.id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="lg:w-14 px-5 py-4 whitespace-nowrap">
                  <label className="cursor-pointer text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                        selected.includes(product.id)
                          ? "border-brand-500 bg-brand-500"
                          : "bg-transparent border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <span
                        className={
                          selected.includes(product.id) ? "" : "opacity-0"
                        }
                      >
                        <SvgIcon name="check" />
                      </span>
                    </span>
                  </label>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12">
                      <img
                        src={product.image}
                        className="h-12 w-12 rounded-md"
                        alt=""
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.category}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {product.brand}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {product.price}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                      product.stock === "In Stock"
                        ? "bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-500"
                        : "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-500"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {product.createdAt}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="relative inline-block">
                    <TableDropdown
                      dropdownButton={
                        <button className="text-gray-500 dark:text-gray-400 ">
                          <SvgIcon name="more-horizontal" />
                        </button>
                      }
                      dropdownContent={
                        <>
                          <button className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            View More
                          </button>
                          <button className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            Delete
                          </button>
                        </>
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center flex-col sm:flex-row justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="pb-3 sm:pb-0">
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="text-gray-800 dark:text-white/90">
              {startItem()}
            </span>{" "}
            to{" "}
            <span className="text-gray-800 dark:text-white/90">
              {endItem()}
            </span>{" "}
            of{" "}
            <span className="text-gray-800 dark:text-white/90">
              {products.length}
            </span>
          </span>
        </div>
        <Pages page={page} lastPages={totalPages()} onChange={setPage} />
      </div>
    </div>
  );
};

export default ProductListTable;
