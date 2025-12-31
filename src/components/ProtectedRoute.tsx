import { Navigate } from "react-router";
import { authService } from "../api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = authService.isAuthenticated();
  if (!isAuth) return <Navigate to="/signin" replace />;

  return <>{children}</>;
}
