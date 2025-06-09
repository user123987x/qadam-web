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
    <nav
      className="mobile-nav"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around w-full h-full max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 transition-all duration-200 flex-1 h-full relative",
                "text-neutral-500 hover:text-neutral-700 active:scale-95 active:bg-neutral-100/50",
                isActive && "text-soft-green",
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-soft-green rounded-full" />
              )}
              <IconComponent
                size={20}
                className="transition-all duration-200"
              />
              <span className="text-xs font-medium transition-all duration-200 leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
