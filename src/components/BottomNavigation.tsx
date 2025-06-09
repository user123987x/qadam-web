import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/constants";

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 min-w-0 flex-1 h-full transition-colors",
                isActive
                  ? "text-emerald-600"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
