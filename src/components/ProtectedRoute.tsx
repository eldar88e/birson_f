import { Navigate } from "react-router";
import { authService } from "../api/auth";
import { ROUTES } from "../shared/config/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = authService.isAuthenticated();
  if (!isAuth) return <Navigate to={ROUTES.AUTH.SIGN_IN} replace />;

  return <>{children}</>;
}
