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

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
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
        throw new ApiError(
          data?.message || `Request failed with status ${response.status}`,
          response.status,
          data
        );
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

