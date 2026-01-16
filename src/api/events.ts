import { apiClient } from "./client";
import type { Event } from "../entities/event/model";
import { ROUTES } from "../shared/config/routes";

interface Events {
  data: Event[];
  meta: { start_at: string; end_at: string };
}

export type CreateEventData = {
  title: string;
  starts_at: string;
  ends_at?: string | null;
  kind: "primary" | "success" | "warning" | "danger";
};

export type UpdateEventData = Partial<CreateEventData>;

export const eventService = {
  getEvents: async (params: string = ""): Promise<Events> => {
    const url = `${ROUTES.EVENTS.INDEX}${params}`;
    const response = await apiClient.get<Events>(url, true);
    return response;
  },

  getEvent: async (id: number): Promise<Event> => {
    const response = await apiClient.get<{ event: Event }>(`${ROUTES.EVENTS.INDEX}/${id}`, true);
    return response.event;
  },

  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    const response = await apiClient.post<{ event: Event }>(
      `${ROUTES.EVENTS.INDEX}`,
      { event: eventData },
      true
    );
    return response.event;
  },

  updateEvent: async (id: number, eventData: UpdateEventData): Promise<Event> => {
    const response = await apiClient.put<{ event: Event }>(
      `${ROUTES.EVENTS.INDEX}/${id}`,
      { event: eventData },
      true
    );
    return response.event;
  },
};
