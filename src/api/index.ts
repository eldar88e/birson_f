// Export all API services and types
export { apiClient, ApiError } from "./client";
export { authService } from "./auth";
export type { LoginCredentials, LoginResponse } from "./auth";
export { userService } from "./users";
export { carService } from "./cars";
export { appointmentItemService } from "./appointmetItems";
export { contractorService } from "./contractors";
export { serviceService } from "./services";
export type { AppointmentItem, CreateAppointmentItemData } from "./appointmetItems";
