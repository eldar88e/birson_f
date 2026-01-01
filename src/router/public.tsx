import { Route } from "react-router";
import { ROUTES } from "../shared/config/routes";

import SignIn from "../pages/AuthPages/SignIn";
// import ResetPassword from "../pages/AuthPages/ResetPassword";
import NotFound from "../pages/NotFound.tsx";

export const publicRoutes = (
  <>
    <Route path={ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
    <Route path="*" element={<NotFound />} />
  </>
);
