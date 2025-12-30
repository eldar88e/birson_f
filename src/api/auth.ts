import { apiClient } from "./client";

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Auth service
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/login",
      {
        user: {
          email: credentials.email,
          password: credentials.password,
        },
      }
    );

    // Save token to localStorage
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      "/register",
      credentials
    );

    // Save token to localStorage
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): LoginResponse["user"] | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Request password reset
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return apiClient.post<ResetPasswordResponse>("/reset-password", data);
  }

  /**
   * Verify token validity (optional - if your API has this endpoint)
   */
  async verifyToken(): Promise<boolean> {
    try {
      await apiClient.get("/verify-token", true);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

