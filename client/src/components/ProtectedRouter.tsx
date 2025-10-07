import React, { type JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../stores/store";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const role = user?.role;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

  return children;
}
