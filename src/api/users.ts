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

  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get<UsersResponse>(
      `${ROUTES.USERS.INDEX}?q%5Bfull_name_or_phone_cont_any%5D=${encodeURIComponent(query)}&button=`,
      true
    );
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
