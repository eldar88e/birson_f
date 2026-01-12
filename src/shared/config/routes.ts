export const ROUTES = {
  ROOT: "/",

  AUTH: {
    SIGN_IN: "/signin",
  },

  CALENDAR: "/calendar",
  KANBAN: "/task-kanban",

  APPOINTMENTS: {
    INDEX: "/appointments",
    ADD_APPOINTMENT: "/appointments/add",
  },

  USERS: {
    INDEX: "/users",
    ADD_USER: "/users/add",
  },

  SYSTEM: {
    MAINTENANCE: "/maintenance",
    SUCCESS: "/success",
    FIVE_HUNDRED: "/five-zero-zero",
    FIVE_ZERO_THREE: "/five-zero-three",
    COMING_SOON: "/coming-soon",
    NOT_FOUND: "*",
  },
  CARS: {
    INDEX: "/cars",
    ADD: "/cars/add"
  },
  CONTRACTORS: {
    INDEX: "/contractors",
    ADD: "/contractors/add"
  },
} as const;
