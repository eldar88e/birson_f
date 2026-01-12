import type { User } from "../../entities/user/model";

export const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getAuthStorage(): Storage {
  return localStorage.getItem(TOKEN_KEY)
    ? localStorage
    : sessionStorage;
}

export function saveAuth(
  token: string,
  rememberMe: boolean
) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
}

export function saveUser(user: User) {
  const userData = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    first_name: user.first_name,
    middle_name: user.middle_name,
    last_name: user.last_name,
    role: user.role,
    phone: user.phone
  };
  const storage = getAuthStorage();
  storage.setItem(USER_KEY, JSON.stringify(userData));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getStoredUser<T>() {
  const storage = getAuthStorage();
  const raw = storage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function getStoredToken() {
  return getAuthStorage().getItem(TOKEN_KEY);
}

function decodeJWT(token: string | null): any | null {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function getStoredSessionId(): string | null {
  const token = getStoredToken();
  if (!token) return null;
  
  const payload = decodeJWT(token);
  return payload?.session_id;
}

export function getStoredRefreshToken(): string | null {
  const token = getStoredToken();
  if (!token) return null;
  
  const payload = decodeJWT(token);
  return payload?.refresh_token;
}