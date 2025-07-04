import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import type { JSX } from "react";

interface protectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: protectedRouteProps) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;