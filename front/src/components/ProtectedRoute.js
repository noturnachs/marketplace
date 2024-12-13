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
        const authData = await authService.checkAuth();
        setIsAuthenticated(true);
        localStorage.setItem("userData", JSON.stringify(authData));
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.clear();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (process.env.NODE_ENV === "production") {
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.onrender.com; secure; samesite=none;";
        }
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
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
