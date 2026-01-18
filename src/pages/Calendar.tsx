import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg, DatesSetArg } from "@fullcalendar/core";
import ruLocale from "@fullcalendar/core/locales/ru";
import enLocale from "@fullcalendar/core/locales/en-gb";
import trLocale from "@fullcalendar/core/locales/tr";
import arLocale from "@fullcalendar/core/locales/ar";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { eventService } from "../api/events";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ROUTES } from "../shared/config/routes";
import { CalenderIcon } from "../icons";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useNotification } from "../context/NotificationContext";
import { Russian } from "flatpickr/dist/l10n/ru";
import { english } from "flatpickr/dist/l10n/default";
import { Turkish } from "flatpickr/dist/l10n/tr";
import { Arabic } from "flatpickr/dist/l10n/ar";

const flatpickrLocaleMap: Record<string, any> = {
  ru: Russian,
  en: english,
  tr: Turkish,
  ar: Arabic,
};

const fullCalendarLocaleMap: Record<string, any> = {
  ru: ruLocale,
  en: enLocale,
  tr: trLocale,
  ar: arLocale,
};

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    eventable_type?: string;
    eventable_id?: number;
  };
}

const APPOINTMENT_TYPE = "Order";

// Компонент DatePicker с поддержкой времени
const DateTimePicker: React.FC<{
  id: string;
  value: string;
  onChange: (dateStr: string | null) => void;
  placeholder?: string;
}> = ({ id, value, onChange, placeholder }) => {
  const { i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);
  const currentLocale = i18n.language || "ru";
  const locale = flatpickrLocaleMap[currentLocale] || flatpickrLocaleMap.ru;

  useEffect(() => {
    if (inputRef.current) {
      const fp = flatpickr(inputRef.current, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true,
        static: true,
        monthSelectorType: "static",
        defaultDate: value || undefined,
        locale,
        onChange: (selectedDates) => {
          // Форматируем для datetime-local (YYYY-MM-DDTHH:mm)
          if (selectedDates.length > 0) {
            const date = selectedDates[0];
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            onChange(`${year}-${month}-${day}T${hours}:${minutes}`);
          } else {
            onChange(null);
          }
        },
      });

      flatpickrRef.current = fp;

      return () => {
        if (fp && !Array.isArray(fp)) {
          fp.destroy();
        }
      };
    }
  }, [id, onChange, locale]);

  // Обновляем значение при изменении value извне
  useEffect(() => {
    if (flatpickrRef.current && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        flatpickrRef.current.setDate(date, false);
      }
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        placeholder={placeholder}
        className="dark:bg-dark-900 h-11 w-full rounded-lg border appearance-none px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
      />
      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <CalenderIcon className="size-6" />
      </span>
    </div>
  );
};

const Calendar: React.FC = () => {
  const { t, i18n } = useTranslation("event");
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const currentLocale = i18n.language || "ru";
  const calendarLocale = fullCalendarLocaleMap[currentLocale] || fullCalendarLocaleMap.ru;
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { start, end };
  });

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    const { start, end, view } = arg;
    let normalizedStart = new Date(start);
    let normalizedEnd = new Date(end);

    if (view.type === "dayGridMonth") {
      const midDate = new Date((start.getTime() + end.getTime()) / 2);
      const monthToUse = midDate.getMonth();
      const yearToUse = midDate.getFullYear();
      
      normalizedStart = new Date(yearToUse, monthToUse, 1);
      normalizedEnd = new Date(yearToUse, monthToUse + 1, 0, 23, 59, 59, 999);
    } else {
      normalizedStart.setHours(0, 0, 0, 0);
      normalizedEnd.setHours(23, 59, 59, 999);
    }
    
    setDateRange({ start: normalizedStart, end: normalizedEnd });
  };

  const loadEvents = async () => {
    try {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      const params = `?q[starts_at_gteq]=${encodeURIComponent(startDateStr)}&q[starts_at_lt]=${encodeURIComponent(endDateStr)}`;
      
      const response = await eventService.getEvents(params);
      const calendarEvents: CalendarEvent[] = response.data
        .filter((event: any) => {
          const startDate = event.starts_at || event.start_at || event.startAt || event.start || event.appointment_at;
          return startDate && startDate.trim() !== "";
        })
        .map((event: any) => {
          const startDateRaw = event.starts_at || event.start_at || event.startAt || event.start || event.appointment_at;
          const endDateRaw = event.ends_at || event.end_at || event.endAt || event.end;

          let startDate = startDateRaw;
          let endDate = endDateRaw || undefined;

          if (startDate && typeof startDate === "string" && startDate.includes("T")) {
            startDate = startDate.split("T")[0];
          }
          if (endDate && typeof endDate === "string" && endDate.includes("T")) {
            endDate = endDate.split("T")[0];
          }

          const title = event.eventable_type === APPOINTMENT_TYPE ? `${t("appointment_title")} #${event.eventable_id}` : event.title;
          
          return {
            id: String(event.id),
            title: title,
            start: startDate,
            end: endDate || undefined,
            allDay: true,
            extendedProps: {
              calendar: event.kind ? 
                event.kind.charAt(0).toUpperCase() + event.kind.slice(1) : 
                "Primary",
              eventable_type: event.eventable_type,
              eventable_id: event.eventable_id,
            },
          };
        });
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [dateRange]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    // Форматируем для datetime-local (YYYY-MM-DDTHH:mm)
    const formatForDateTimeLocal = (dateStr: string) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    setEventStartDate(formatForDateTimeLocal(selectInfo.startStr));
    setEventEndDate(formatForDateTimeLocal(selectInfo.endStr || selectInfo.startStr));
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const extendedProps = event.extendedProps as CalendarEvent["extendedProps"];

    if (extendedProps.eventable_type === APPOINTMENT_TYPE && extendedProps.eventable_id) {
      navigate(`${ROUTES.APPOINTMENTS.INDEX}/${extendedProps.eventable_id}`);
      return;
    }

    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    // Форматируем дату и время для datetime-local (YYYY-MM-DDTHH:mm)
    const formatForDateTimeLocal = (date: Date | null | undefined) => {
      if (!date) return "";
      // Получаем локальную дату и время без смещения часового пояса
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    setEventStartDate(formatForDateTimeLocal(event.start ? new Date(event.start) : null));
    setEventEndDate(formatForDateTimeLocal(event.end ? new Date(event.end) : null));
    setEventLevel(extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    if (!eventTitle.trim()) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Необходимо указать название события",
      });
      return;
    }

    if (!eventStartDate) {
      showNotification({
        variant: "error",
        title: "Ошибка валидации",
        description: "Необходимо указать дату начала",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // datetime-local возвращает формат YYYY-MM-DDTHH:mm, нужно добавить секунды для ISO
      const formatForISO = (dateTime: string) => {
        if (!dateTime) return "";
        // Если формат уже содержит время, добавляем секунды, иначе возвращаем как есть
        if (dateTime.includes("T")) {
          return dateTime + ":00";
        }
        return dateTime;
      };

      const startsAt = formatForISO(eventStartDate);
      const endsAt = eventEndDate ? formatForISO(eventEndDate) : null;

      // Преобразуем calendar в kind (Primary -> primary)
      const kind = eventLevel ? eventLevel.toLowerCase() as "primary" | "success" | "warning" | "danger" : "primary";

      if (selectedEvent && selectedEvent.id) {
        // Update existing event
        const eventId = parseInt(selectedEvent.id);
        await eventService.updateEvent(eventId, {
          title: eventTitle,
          starts_at: startsAt,
          ends_at: endsAt,
          kind,
        });
        showNotification({
          variant: "success",
          title: "Событие обновлено!",
          description: "Событие успешно обновлено",
        });
      } else {
        // Create new event
        await eventService.createEvent({
          title: eventTitle,
          starts_at: startsAt,
          ends_at: endsAt,
          kind,
        });
        showNotification({
          variant: "success",
          title: "Событие создано!",
          description: "Новое событие успешно добавлено",
        });
      }

      // Перезагружаем события для текущего диапазона дат
      await loadEvents();
      closeModal();
      resetModalFields();
    } catch (error) {
      showNotification({
        variant: "error",
        title: selectedEvent ? "Ошибка обновления" : "Ошибка создания",
        description: error instanceof Error ? error.message : "Не удалось сохранить событие",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={calendarLocale}
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
            customButtons={{
              addEventButton: {
                text: `${t("btn.add")} +`,
                click: openModal,
              },
            }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? `${t("edit_event_title")}` : `${t("add_event_title")}`}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("event_description")}
              </p>
            </div>
            <div className="mt-8">
              <div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {t("title")}
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  {t("color")}
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <div key={key} className="n-chk">
                      <div
                        className={`form-check form-check-${value} form-check-inline`}
                      >
                        <label
                          className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                          htmlFor={`modal${key}`}
                        >
                          <span className="relative">
                            <input
                              className="sr-only form-check-input"
                              type="radio"
                              name="event-level"
                              value={key}
                              id={`modal${key}`}
                              checked={eventLevel === key}
                              onChange={() => setEventLevel(key)}
                            />
                            <span
                              className={`rounded-full flex items-center justify-center w-5 h-5 mr-2 border border-gray-300  box dark:border-gray-700`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full bg-white ${
                                  eventLevel === key ? "block" : "hidden"
                                }`}
                              ></span>
                            </span>
                          </span>
                          {t(`kind.${value}`)}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {t("start_time")}
                </label>
                <DateTimePicker
                  id="event-start-date"
                  value={eventStartDate}
                  onChange={(dateStr: string | null) => setEventStartDate(dateStr || "")}
                  placeholder="Выберите дату и время"
                />
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {t("end_time")}
                </label>
                <DateTimePicker
                  id="event-end-date"
                  value={eventEndDate}
                  onChange={(dateStr: string | null) => setEventEndDate(dateStr || "")}
                  placeholder={t("placeholder.end_time")}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                {t("btn.close")}
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                type="button"
                disabled={isSubmitting}
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
              >
                {isSubmitting ? "Сохранение..." : selectedEvent ? `${t("btn.update")}` : `${t("btn.add")}`}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
