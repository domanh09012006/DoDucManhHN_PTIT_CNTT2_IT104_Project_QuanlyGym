import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../stores/store";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: "admin" | "user";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { currentUser, role } = useSelector(
    (state: RootState) => state.auth
  );
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
