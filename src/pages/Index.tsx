import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Dashboard immediately
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100">
      <div className="text-center">
        <div className="text-6xl mb-4">🏗️</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Construction Manager
        </h1>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
