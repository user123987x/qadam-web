import { UserRole } from "@/lib/types";
import { mockUsers } from "@/lib/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployerIcon, WorkerIcon, SupplierIcon } from "@/components/ui/icons";

export const UserRoleSelector = () => {
  const { currentUser, switchUser } = useUserRole();

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "employer":
        return EmployerIcon;
      case "worker":
        return WorkerIcon;
      case "supplier":
        return SupplierIcon;
      default:
        return WorkerIcon;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "employer":
        return "text-deep-blue";
      case "worker":
        return "text-soft-green";
      case "supplier":
        return "text-deep-blue";
      default:
        return "text-neutral-600";
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "employer":
        return "bg-deep-blue/10 text-deep-blue border-deep-blue/20";
      case "worker":
        return "bg-soft-green/10 text-soft-green border-soft-green/20";
      case "supplier":
        return "bg-deep-blue/10 text-deep-blue border-deep-blue/20";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "employer":
        return "Manage projects, workers, and track progress";
      case "worker":
        return "Log daily work and track earnings";
      case "supplier":
        return "Manage material deliveries and inventory";
      default:
        return "";
    }
  };

  return (
    <div className="app-card border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-amber-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          Demo Mode
        </CardTitle>
        <CardDescription className="text-amber-700">
          Switch between different user types to explore the app features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockUsers.map((user) => {
          const IconComponent = getRoleIcon(user.role);
          const isSelected = currentUser?.id === user.id;

          return (
            <div
              key={user.id}
              className={`
                relative p-4 rounded-xl border transition-all duration-200
                ${
                  isSelected
                    ? "border-soft-green bg-white shadow-soft"
                    : "border-white/60 bg-white/40 hover:bg-white/60 hover:border-white/80"
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-6 h-6 bg-soft-green rounded-full -translate-y-2 translate-x-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-br from-soft-green to-deep-blue"
                      : "bg-gradient-to-br from-neutral-100 to-neutral-200"
                  }`}
                >
                  <IconComponent
                    size={24}
                    className={
                      isSelected ? "text-white" : getRoleColor(user.role)
                    }
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-neutral-800 truncate flex-1">
                      {user.name}
                    </h3>
                    <Badge
                      className={`${getRoleBadgeClass(user.role)} shrink-0`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-1">
                    {getRoleDescription(user.role)}
                  </p>
                </div>

                {!isSelected && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => switchUser(user.id)}
                    className="btn-outline shrink-0"
                  >
                    Switch
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <div className="text-xs text-amber-700 text-center pt-2 border-t border-amber-200">
          This demo mode allows you to experience the app from different
          perspectives
        </div>
      </CardContent>
    </div>
  );
};
