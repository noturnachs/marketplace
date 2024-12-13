import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import LoadingSpinner from "./LoadingSpinner";

function PublicRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authData = await authService.checkAuth();
        setIsAuthenticated(true);
        localStorage.setItem("userData", JSON.stringify(authData));
      } catch (error) {
        setIsAuthenticated(false);
        // Clear auth data on failure
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

    // Only verify if not on logout path
    if (location.pathname !== "/logout") {
      verifyAuth();
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [location]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Get the intended destination or default to dashboard
    const from = location.state?.from || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
}

export default PublicRoute;
