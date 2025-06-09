import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserRoleSelector } from "@/components/UserRoleSelector";
import { useUserRole } from "@/hooks/useUserRole";
import {
  mockProjects,
  mockWorkLogs,
  mockMaterials,
  mockWorkers,
} from "@/lib/constants";

const Profile = () => {
  const { currentUser, userRole, isEmployer, isWorker, isSupplier } =
    useUserRole();

  const getProfileStats = () => {
    if (isEmployer) {
      const activeProjects = mockProjects.filter(
        (p) => p.status === "active",
      ).length;
      const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
      const totalSpent = mockProjects.reduce(
        (sum, p) => sum + p.spentAmount,
        0,
      );

      return [
        { label: "Total Projects", value: mockProjects.length },
        { label: "Active Projects", value: activeProjects },
        { label: "Total Budget", value: `$${totalBudget.toLocaleString()}` },
        { label: "Amount Spent", value: `$${totalSpent.toLocaleString()}` },
      ];
    }

    if (isWorker) {
      const worker = mockWorkers.find((w) => w.id === currentUser?.id);
      const workerLogs = mockWorkLogs.filter(
        (l) => l.workerId === currentUser?.id,
      );
      const totalEarnings = workerLogs.reduce((sum, l) => sum + l.earnings, 0);
      const totalArea = workerLogs.reduce((sum, l) => sum + l.areaCompleted, 0);

      return [
        { label: "Specialization", value: worker?.specialization || "N/A" },
        { label: "Rate per m²", value: `$${worker?.ratePerSquareMeter || 0}` },
        {
          label: "Total Earnings",
          value: `$${totalEarnings.toLocaleString()}`,
        },
        { label: "Area Completed", value: `${totalArea} m²` },
      ];
    }

    if (isSupplier) {
      const deliveredValue = mockMaterials.reduce(
        (sum, m) => sum + m.usedQuantity * m.pricePerUnit,
        0,
      );
      const lowStockItems = mockMaterials.filter(
        (m) => m.remainingQuantity / m.totalQuantity < 0.2,
      ).length;

      return [
        { label: "Materials Supplied", value: mockMaterials.length },
        {
          label: "Total Delivered Value",
          value: `$${deliveredValue.toLocaleString()}`,
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{currentUser?.avatar}</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {currentUser?.name}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge
                className={`
                ${userRole === "employer" ? "bg-blue-100 text-blue-800" : ""}
                ${userRole === "worker" ? "bg-emerald-100 text-emerald-800" : ""}
                ${userRole === "supplier" ? "bg-purple-100 text-purple-800" : ""}
              `}
              >
                {userRole
                  ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
                  : "Guest"}
              </Badge>
            </div>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Statistics</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">🔔</span>
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">🌙</span>
              Dark Mode
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">🌍</span>
              Language & Region
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">📊</span>
              Export Data
            </Button>
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
