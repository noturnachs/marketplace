import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import LoadingSpinner from "./LoadingSpinner";

function PublicRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
