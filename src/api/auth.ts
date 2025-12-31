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

class AuthService {
  private getToken(): string | null {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  private getUser(): any {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
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

    let token = response.token || response.access_token || response.jwt;
    let user = response.user || response.data?.user;
    const storage = rememberMe ? localStorage : sessionStorage;

    if (token) {
      storage.setItem("token", token);
      if (user) storage.setItem("user", JSON.stringify(user));
    } else {
      throw new Error("No token received from server");
    }

    return { token, user } as LoginResponse;
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

  getCurrentUser(): any {
    return this.getUser();
  }
}

export const authService = new AuthService();
