import { apiClient } from "./client";
import type { Position } from "../entities/position/model";
import { ROUTES } from "../shared/config/routes";
import type { PaginationMeta } from "../shared/types/api/pagination";

interface PositionsResponse {
  data: Position[];
}

interface Positions {
  data: Position[];
  meta: PaginationMeta;
}

export type CreatePositionData = Omit<Position, "id">;

class PositionService {
  async getPositions(params: string): Promise<Positions> {
    const url = `${ROUTES.POSITIONS.INDEX}${params}`
    const response = await apiClient.get<Positions>(url, true);
    return response;
  }

  async searchPositions(query: string): Promise<Position[]> {
    const response = await apiClient.get<PositionsResponse>(
      `${ROUTES.POSITIONS.INDEX}?q%5Bname_cont_any%5D=${encodeURIComponent(query)}&button=`,
      true
    );
    return response.data;
  }

  async getPosition(id: number): Promise<Position[]> {
    const response = await apiClient.get<PositionsResponse>(
      `${ROUTES.POSITIONS.INDEX}?q%5Bid_eq%5D=${id}`,
      true
    );
    return response.data;
  }

  async createPosition(positionData: CreatePositionData): Promise<Position> {
    const response = await apiClient.post<{ position: Position }>(
      ROUTES.POSITIONS.INDEX,
      { position: positionData },
      true
    );
    return response.position;
  }

  async updatePosition(id: number, positionData: CreatePositionData): Promise<Position> {
    const response = await apiClient.patch<{ position: Position }>(
      `${ROUTES.POSITIONS.INDEX}/${id}`,
      { position: positionData },
      true
    );
    return response.position;
  }

  async deletePosition(id: number): Promise<void> {
    await apiClient.delete(`${ROUTES.POSITIONS.INDEX}/${id}`, true);
  }
}

export const positionService = new PositionService();

