import { getStoredToken, clearAuth, getStoredSessionId, getStoredRefreshToken, saveAuth, TOKEN_KEY } from "../shared/lib/authStorage";
import { ROUTES } from "../shared/config/routes";
import { notificationService } from "../context/NotificationContext";

const API_BASE_URL = "https://birson.tgapp.online/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private refreshingToken: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return getStoredToken();
  }

  private buildHeaders(requiresAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = getStoredRefreshToken();
    const sessionId = getStoredSessionId();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const url = `${this.baseURL}/refresh_token`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        session_id: sessionId,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (data.code === "refresh_token_expired") {
        this.exitSession();
      } else {
        throw new ApiError(
          data?.message || "Token refresh failed",
          response.status,
          data
        );
      }
    }

    const newToken = data.access_token;
    saveAuth(newToken, !!localStorage.getItem(TOKEN_KEY));

    return newToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = false, ...fetchOptions } = options;

    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(requiresAuth);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          // check recursive request
          if (endpoint === "/refresh_token") {
            this.exitSession();
          }

          if (data.code === "token_expired") {
            if (this.refreshingToken) {
              try {
                await this.refreshingToken;
                return this.request<T>(endpoint, options);
              } catch (error) {
                this.exitSession();
              }
            }

            this.refreshingToken = this.refreshToken();

            try {
              await this.refreshingToken;
              return this.request<T>(endpoint, options);
            } catch (error) {
              this.exitSession();
            } finally {
              this.refreshingToken = null;
            }
          } else {
            throw new ApiError(
              data?.message || "Unauthorized",
              response.status,
              data
            );
          }
        } else {
          throw new ApiError(
            data?.message || `Request failed with status ${response.status}`,
            response.status,
            data
          );
        }
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Network error occurred"
      );
    }
  }

  private exitSession() {
    clearAuth();
    notificationService.showNotification({
      variant: "error",
      title: "Ошибка",
      description: "Сессия истекла. Пожалуйста, авторизуйтесь снова.",
    });
    setTimeout(() => {
      window.location.href = ROUTES.AUTH.SIGN_IN;
    }, 3000);
  }

  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      requiresAuth,
    });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    });
  }

  async delete<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      requiresAuth,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
