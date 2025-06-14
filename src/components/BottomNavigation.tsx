import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  ProjectIcon,
  AddIcon,
  UserIcon,
} from "@/components/ui/icons";

const navigationItems = [
  { key: "home", label: "Главная", icon: HomeIcon, path: "/dashboard" },
  { key: "projects", label: "Проекты", icon: ProjectIcon, path: "/projects" },
  { key: "add", label: "Добавить", icon: AddIcon, path: "/add-entry" },
  { key: "profile", label: "Профиль", icon: UserIcon, path: "/profile" },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="mobile-nav"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex items-center justify-around w-full max-w-md">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 px-3 transition-all duration-200 flex-1 relative",
                  "hover:bg-gray-100/50 active:scale-95 min-h-[60px]",
                  isActive ? "text-green-600" : "text-gray-500",
                )}
                style={{
                  minWidth: "60px",
                  minHeight: "60px",
                }}
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-1/2 w-8 h-1 bg-green-600 rounded-full"
                    style={{
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
                <IconComponent
                  size={20}
                  className="transition-all duration-200"
                />
                <span className="text-xs font-medium transition-all duration-200 leading-tight text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
