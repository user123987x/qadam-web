import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  ProjectIcon,
  AddIcon,
  UserIcon,
} from "@/components/ui/icons";

const navigationItems = [
  { key: "home", label: "Home", icon: HomeIcon, path: "/dashboard" },
  { key: "projects", label: "Projects", icon: ProjectIcon, path: "/projects" },
  { key: "add", label: "Add Entry", icon: AddIcon, path: "/add-entry" },
  { key: "profile", label: "Profile", icon: UserIcon, path: "/profile" },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="mobile-nav safe-area-bottom">
      <div className="flex items-stretch w-full h-full">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={cn("mobile-nav-item flex-1", isActive && "active")}
            >
              <IconComponent
                size={20}
                className={cn(
                  "transition-all duration-200 mb-1",
                  isActive ? "text-soft-green" : "text-neutral-500",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200 leading-none",
                  isActive ? "text-soft-green" : "text-neutral-500",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
