export const ROUTES = {
  ROOT: "/",

  AUTH: {
    SIGN_IN: "/signin",
  },

  CALENDAR: "/calendar",
  KANBAN: "/task-kanban",

  INVOICES: {
    INDEX: "/invoices",
    SHOW: "/single-invoice",
  },

  PRODUCTS: {
    INDEX: "/products",
    ADD_PRODUCT: "/add-product",
  },

  USERS: {
    INDEX: "/users"
  },

  SYSTEM: {
    MAINTENANCE: "/maintenance",
    SUCCESS: "/success",
    FIVE_HUNDRED: "/five-zero-zero",
    FIVE_ZERO_THREE: "/five-zero-three",
    COMING_SOON: "/coming-soon",
    NOT_FOUND: "*",
  },
} as const;
