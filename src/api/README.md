# API Documentation

## Overview

This directory contains the API client and service modules for the application.

## Structure

- `client.ts` - Base HTTP client with error handling
- `auth.ts` - Authentication service (login, register, logout)
- `index.ts` - Main export file for all API services

## Usage

### Authentication

#### Login

```typescript
import { authService } from "@/api/auth";

try {
  const response = await authService.login({
    email: "user@example.com",
    password: "password123",
  });
  
  console.log("Logged in:", response.user);
  // Token is automatically saved to localStorage
} catch (error) {
  console.error("Login failed:", error.message);
}
```

#### Register

```typescript
import { authService } from "@/api/auth";

try {
  const response = await authService.register({
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
  });
  
  console.log("Registered:", response.user);
} catch (error) {
  console.error("Registration failed:", error.message);
}
```

#### Logout

```typescript
import { authService } from "@/api/auth";

authService.logout();
// Removes token and user data from localStorage
```

#### Check Authentication Status

```typescript
import { authService } from "@/api/auth";

if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
  console.log("Current user:", user);
}
```

### Making Custom API Calls

```typescript
import { apiClient } from "@/api/client";

// GET request (with authentication)
const data = await apiClient.get("/users/profile", true);

// POST request (without authentication)
const result = await apiClient.post("/contact", {
  name: "John",
  message: "Hello",
});

// PUT request (with authentication)
const updated = await apiClient.put("/users/profile", {
  name: "Jane Doe",
}, true);

// DELETE request (with authentication)
await apiClient.delete("/users/account", true);
```

## Configuration

The API base URL is configured in `client.ts`:

```typescript
const API_BASE_URL = "https://birson.tgapp.online/api/v1";
```

To change the API endpoint, modify this constant.

## Error Handling

All API errors are wrapped in the `ApiError` class:

```typescript
import { ApiError } from "@/api/client";

try {
  await authService.login(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    console.log("Status:", error.status);
    console.log("Message:", error.message);
    console.log("Data:", error.data);
  }
}
```

## Token Management

- Tokens are automatically stored in `localStorage` after successful login/register
- Tokens are automatically included in requests when `requiresAuth` is `true`
- Tokens are removed on logout

## Adding New Services

To add a new service:

1. Create a new file in `src/api/` (e.g., `users.ts`)
2. Import and use `apiClient`
3. Export your service from `index.ts`

Example:

```typescript
// src/api/users.ts
import { apiClient } from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
}

class UserService {
  async getProfile(): Promise<User> {
    return apiClient.get<User>("/users/profile", true);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put<User>("/users/profile", data, true);
  }
}

export const userService = new UserService();
```

