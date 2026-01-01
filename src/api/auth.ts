import { apiClient } from "./client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  additional_phone: string;
  company_name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legal_address: string;
  actual_address: string;
  contact_person: string;
  contact_phone: string;
  bank_name: string;
  bik: string;
  checking_account: string;
  correspondent_account: string;
  source: string;
  comment: string | null;
  active: boolean;
  role: string;
  created_at: string;
}

class AuthService {
  private getToken(): string | null {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  private getUser(): User | null {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private decodeToken(token: string): { user_id?: number } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }

  private async fetchUserData(userId: number, storage: Storage): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`/users/${userId}`, true);
    const user = response.user;

    storage.setItem("user", JSON.stringify(user));

    return user;
  }

  async login(credentials: LoginCredentials, rememberMe: boolean = false): Promise<LoginResponse> {
    const response = await apiClient.post<any>(
      "/login",
      {
        user: {
          email: credentials.email,
          password: credentials.password,
        },
      }
    );

    const token = response.token || response.access_token || response.jwt;
    const storage = rememberMe ? localStorage : sessionStorage;

    if (!token) {
      throw new Error("No token received from server");
    }

    storage.setItem("token", token);

    const decoded = this.decodeToken(token);
    const userId = decoded?.user_id;

    if (!userId) {
      throw new Error("No user_id found in token");
    }

    try {
      const user = await this.fetchUserData(userId, storage);

      return {
        token,
        user: {
          id: user.id.toString(),
          email: user.email,
          name: user.full_name
        }
      };
    } catch (error) {
      return {
        token,
        user: {
          id: userId.toString(),
          email: credentials.email
        }
      };
    }
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.getUser();
  }

  async refreshUserData(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    const userId = decoded?.user_id;

    if (!userId) return null;

    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;

    try {
      return await this.fetchUserData(userId, storage);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
