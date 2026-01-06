// Export all API services and types
export { apiClient, ApiError } from "./client";
export { authService } from "./auth";
export type { LoginCredentials, LoginResponse } from "./auth";
export { userService } from "./users";
export { carService } from "./cars";
export { orderItemService } from "./orderItems";
export { contactorService } from "./contactors";
export type { OrderItem, CreateOrderItemData } from "./orderItems";
