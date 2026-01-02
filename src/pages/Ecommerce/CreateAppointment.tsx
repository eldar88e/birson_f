import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import UserAutocomplete from "../../components/form/UserAutocomplete";
import type { User } from "../../entities/user/model";

import Button from "../../components/ui/button/Button";
import InvoicePreviewModal from "../../components/ecommerce/create-invoice/InvoicePreviewModal";
import CreateInvoiceTable from "../../components/ecommerce/create-invoice/CreateInvoiceTable";

export default function CreateAppointment() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <PageMeta
        title="Создать запись | CRM"
        description="Добавление новой записи в CRM систему"
      />
      <PageBreadcrumb pageTitle="Запись" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-xl font-medium text-gray-800 dark:text-white">
            Добавить запись
          </h2>
        </div>
        <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800">
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <UserAutocomplete
                  label="Клиент"
                  placeholder="Введите имя или номер телефона"
                  value={selectedUser}
                  onChange={setSelectedUser}
                />
              </div>{" "}
              <div>
                <Label>Авто</Label>
                <Input placeholder="BMW, Audi" />
              </div>{" "}
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label>Статус</Label>
                <select className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30">
                  <option value="initial">В ожидании</option>
                  <option value="processing">В процессе</option>
                  <option value="completed">Завершен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>{" "}
              <div>
                <Label>Оплата</Label>
                <select className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30">
                  <option value="initial">Не оплачен</option>
                  <option value="processing">Оплачен</option>
                </select>
              </div>{" "}
            </div>
            <Label>Комментарий</Label>
            <textarea
              className="dark:bg-dark-900 shadow-theme-xs bg-none appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Введите коментарий..."
            ></textarea>
          </form>
        </div>
        <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800">
          <CreateInvoiceTable />
        </div>
        <div className="p-4 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <InvoicePreviewModal />
            <Button variant="primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M13.333 16.6666V12.9166C13.333 12.2262 12.7734 11.6666 12.083 11.6666L7.91634 11.6666C7.22599 11.6666 6.66634 12.2262 6.66634 12.9166L6.66635 16.6666M9.99967 5.83325H6.66634M15.4163 16.6666H4.58301C3.89265 16.6666 3.33301 16.1069 3.33301 15.4166V4.58325C3.33301 3.8929 3.89265 3.33325 4.58301 3.33325H12.8171C13.1483 3.33325 13.4659 3.46468 13.7003 3.69869L16.2995 6.29384C16.5343 6.52832 16.6662 6.84655 16.6662 7.17841L16.6663 15.4166C16.6663 16.1069 16.1066 16.6666 15.4163 16.6666Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Save Appointment
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
