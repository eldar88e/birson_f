import { apiClient } from "./client";
import { clearAuth, saveAuth, saveUser, getStoredToken, getStoredUser } from "../shared/lib/authStorage";
import type { User } from "../entities/user/model";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

type LoginApiResponse = {
  access_token: string;
  user_id: number;
};

class AuthService {
  private async fetchUserData(userId: number): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`/users/${userId}`, true);
    return response.user;
  }

  async login(credentials: LoginCredentials, rememberMe: boolean = false): Promise<LoginResponse> {
    const response = await apiClient.post<LoginApiResponse>(
      "/login",
      {
        user: {
          email: credentials.email,
          password: credentials.password,
        },
      }
    );

    const token = response.access_token;
    if (!token) throw new Error("No token received from server");

    saveAuth(token, rememberMe);
    const user = await this.fetchUserData(response.user_id);
    saveUser(user);

    return {
      token,
      user,
    };
  }

  logout(): void {
    clearAuth();
  }

  isAuthenticated(): boolean {
    return !!getStoredToken();
  }

  getCurrentUser(): User | null {
    return getStoredUser();
  }
}

export const authService = new AuthService();
