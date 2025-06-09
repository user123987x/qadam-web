import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserRoleSelector } from "@/components/UserRoleSelector";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useUserRole } from "@/hooks/useUserRole";
import {
  mockProjects,
  mockWorkLogs,
  mockMaterials,
  mockWorkers,
} from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import { SettingsIcon, LogOutIcon } from "@/components/ui/icons";

const Profile = () => {
  const { currentUser, userRole, isEmployer, isWorker, isSupplier } =
    useUserRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("authUserId");
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserRole");
    navigate("/login");
  };
  const getProfileStats = () => {
    if (isEmployer) {
      const activeProjects = mockProjects.filter(
        (p) => p.status === "active",
      ).length;
      const totalBudget = mockProjects.reduce(
        (sum, p) => sum + (p.budget || 0),
        0,
      );
      const totalSpent = mockProjects.reduce(
        (sum, p) => sum + (p.spentAmount || 0),
        0,
      );

      return [
        { label: "Total Projects", value: mockProjects.length },
        { label: "Active Projects", value: activeProjects },
        {
          label: "Total Budget",
          value: `$${(totalBudget || 0).toLocaleString()}`,
        },
        {
          label: "Amount Spent",
          value: `$${(totalSpent || 0).toLocaleString()}`,
        },
      ];
    }

    if (isWorker) {
      const worker = mockWorkers.find((w) => w.id === currentUser?.id);
      const workerLogs = mockWorkLogs.filter(
        (l) => l.workerId === currentUser?.id,
      );
      const totalEarnings = workerLogs.reduce(
        (sum, l) => sum + (l.earnings || 0),
        0,
      );
      const totalArea = workerLogs.reduce(
        (sum, l) => sum + (l.areaCompleted || 0),
        0,
      );

      return [
        { label: "Specialization", value: worker?.specialization || "N/A" },
        { label: "Rate per m²", value: `$${worker?.ratePerSquareMeter || 0}` },
        {
          label: "Total Earnings",
          value: `$${(totalEarnings || 0).toLocaleString()}`,
        },
        { label: "Area Completed", value: `${totalArea || 0} m²` },
      ];
    }

    if (isSupplier) {
      const deliveredValue = mockMaterials.reduce(
        (sum, m) => sum + (m.usedQuantity || 0) * (m.pricePerUnit || 0),
        0,
      );
      const lowStockItems = mockMaterials.filter((m) => {
        const remaining = m.remainingQuantity || 0;
        const total = m.totalQuantity || 1; // Avoid division by zero
        return remaining / total < 0.2;
      }).length;

      return [
        { label: "Materials Supplied", value: mockMaterials.length },
        {
          label: "Total Delivered Value",
          value: `$${(deliveredValue || 0).toLocaleString()}`,
        },
        { label: "Low Stock Alerts", value: lowStockItems },
        {
          label: "Active Projects",
          value: mockProjects.filter((p) => p.status === "active").length,
        },
      ];
    }

    return [];
  };

  const profileStats = getProfileStats();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      {/* Header */}
      <div className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-lg border-b border-neutral-200/60 dark:border-neutral-700/60">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="text-center">
            <div className="mb-4">
              <ProfilePhotoUpload size="xl" className="mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              {currentUser?.name}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge
                className={`
                ${userRole === "employer" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : ""}
                ${userRole === "worker" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" : ""}
                ${userRole === "supplier" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" : ""}
              `}
              >
                {userRole
                  ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
                  : "Guest"}
              </Badge>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300">
              {currentUser?.email}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto px-6 py-4 space-y-6">
        {/* Profile Stats */}
        <Card className="app-card">
          <CardHeader>
            <CardTitle className="text-neutral-800 dark:text-neutral-200">
              Profile Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileStats.map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-semibold">{stat.value}</span>
                </div>
                {index < profileStats.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isWorker && (
              <div className="space-y-3">
                {mockWorkLogs
                  .filter((l) => l.workerId === currentUser?.id)
                  .slice(0, 5)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {log.areaCompleted} m² completed
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(log.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-emerald-600">
                          +${log.earnings}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {(isEmployer || isSupplier) && (
              <div className="text-center text-gray-600 py-4">
                Activity tracking coming soon...
              </div>
            )}
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="app-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon size={20} />
              App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-neutral-700 dark:text-neutral-300">
                Notifications
              </span>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between py-2">
              <DarkModeToggle showLabel={true} />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-neutral-700 dark:text-neutral-300">
                Language & Region
              </span>
              <Button variant="outline" size="sm">
                English
              </Button>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-neutral-700 dark:text-neutral-300">
                Export Data
              </span>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Role Switcher (Demo) */}
        <UserRoleSelector />

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">❓</span>
              Help & FAQ
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">📞</span>
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">⭐</span>
              Rate App
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="app-card border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              onClick={handleLogout}
            >
              <LogOutIcon size={20} className="mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="text-center text-xs text-gray-500">
          Construction Manager v1.0.0
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
