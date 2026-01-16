import { apiClient } from "./client";
import type { Event } from "../entities/event/model";
import { ROUTES } from "../shared/config/routes";

interface Events {
  data: Event[];
  meta: { start_at: string; end_at: string };
}

export const eventService = {
  getEvents: async (params: string = ""): Promise<Events> => {
    const url = `${ROUTES.EVENTS.INDEX}${params}`;
    const response = await apiClient.get<Events>(url, true);
    return response;
  },


  getEvent: async (id: number): Promise<Event> => {
    const response = await apiClient.get<{ event: Event }>(`${ROUTES.EVENTS.INDEX}/${id}`, true);
    return response.event;
  }
};
