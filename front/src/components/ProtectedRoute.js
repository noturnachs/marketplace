import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import LoadingSpinner from "./LoadingSpinner";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await authService.checkAuth();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
