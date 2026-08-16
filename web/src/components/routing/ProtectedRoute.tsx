import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types";
import { LoadingState } from "@/components/ui/PageHeader";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirect =
      user.role === "admin"
        ? "/admin"
        : user.role === "caregiver"
          ? "/caregiver"
          : "/client";
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
