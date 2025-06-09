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

export const UserRoleSelector = () => {
  const { currentUser, switchUser } = useUserRole();

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "employer":
        return "bg-blue-100 text-blue-800";
      case "worker":
        return "bg-emerald-100 text-emerald-800";
      case "supplier":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Switch User Role
          <span className="text-lg">🔄</span>
        </CardTitle>
        <CardDescription>
          Demo: Switch between different user types to explore the app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className={`p-3 rounded-lg border transition-all ${
              currentUser?.id === user.id
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{user.avatar}</span>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-600">
                    {getRoleDescription(user.role)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                {currentUser?.id !== user.id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => switchUser(user.id)}
                  >
                    Switch
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
