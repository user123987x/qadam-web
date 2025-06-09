import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check authentication from localStorage
    const checkAuth = () => {
      const authUserId = localStorage.getItem("authUserId");
      const authToken = localStorage.getItem("authToken");

      // For demo, if either exists, consider authenticated
      setIsAuthenticated(!!(authUserId || authToken));
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏗️</div>
          <div className="text-lg font-semibold text-gray-700 mb-2">
            Construction Manager
          </div>
          <div className="text-sm text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
