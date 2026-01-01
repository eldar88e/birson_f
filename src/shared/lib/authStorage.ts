import type { User } from "../../entities/user/model";

const TOKEN_KEY = "token";
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

export function saveUser(
  user: User,
  rememberMe: boolean
) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
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
