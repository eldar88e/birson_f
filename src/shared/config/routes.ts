export const ROUTES = {
  ROOT: "/",

  AUTH: {
    SIGN_IN: "/signin",
  },

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
  },
  CONTRACTORS: {
    INDEX: "/contractors",
  },
  SERVICES: {
    INDEX: "/services",
  },
  EXPENSES: {
    INDEX: "/expenses",
  },
  EVENTS: {
    INDEX: "/events",
  },
  EXPENSE_CATEGORIES: {
    INDEX: "/expense_categories",
  },
  INVESTMENTS: {
    INDEX: "/investments",
  },
  CHATS: {
    INDEX: "/chats",
  },
  CONVERSATIONS: {
    INDEX: "/conversations",
  },
  MESSAGES: {
    INDEX: "/messages",
  },
  POSITIONS: {
    INDEX: "/positions",
  },
} as const;
