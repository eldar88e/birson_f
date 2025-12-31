import { apiClient } from "./client";

export interface User {
  id: string;
  email: string;
  name: string;
}

class UserService {
  async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>("/users", true);
  }
}

export const userService = new UserService();