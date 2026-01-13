import { apiClient } from "./client";
import type { User } from "../entities/user/model";
import { ROUTES } from "../shared/config/routes";

interface UsersResponse {
  data: User[];
}

export type CreateUserData = Omit<User, "id" | "created_at" | "full_name">;

class UserService {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<UsersResponse>(ROUTES.USERS.INDEX, true);
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`${ROUTES.USERS.INDEX}/${id}`, true);
    return response.user;
  }

  async searchUsers(query: string, role?: number): Promise<User[]> {
    let url = `${ROUTES.USERS.INDEX}?q%5Bfull_name_or_phone_cont_any%5D=${encodeURIComponent(query)}&button=`;
    if (role !== undefined) {
      url += `&q%5Brole_eq%5D=${role}`;
    }
    const response = await apiClient.get<UsersResponse>(url, true);
    return response.data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post<{ user: User }>(
      ROUTES.USERS.INDEX,
      { user: userData },
      true
    );
    return response.user;
  }
}

export const userService = new UserService();
