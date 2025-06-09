import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProjectCard } from "@/components/ProjectCard";
import { UserRoleSelector } from "@/components/UserRoleSelector";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useUserRole } from "@/hooks/useUserRole";
import { mockProjects, mockWorkLogs, mockMaterials } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { currentUser, userRole, isEmployer, isWorker, isSupplier } =
    useUserRole();
  const navigate = useNavigate();

  // Calculate dashboard stats based on user role
  const getDashboardData = () => {
    if (isEmployer) {
      const activeProjects = mockProjects.filter((p) => p.status === "active");
      const completedProjects = mockProjects.filter(
        (p) => p.status === "completed",
      );
      const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
      const totalSpent = mockProjects.reduce(
        (sum, p) => sum + p.spentAmount,
        0,
      );

      return {
        title: "Project Overview",
        stats: [
          { label: "Total Projects", value: mockProjects.length, icon: "🏗️" },
          {
            label: "Active Projects",
            value: activeProjects.length,
            icon: "⚡",
          },
          { label: "Completed", value: completedProjects.length, icon: "✅" },
          {
            label: "Budget Used",
            value: `${Math.round((totalSpent / totalBudget) * 100)}%`,
            icon: "💰",
          },
        ],
        recentProjects: activeProjects.slice(0, 2),
      };
    }

    if (isWorker) {
      const workerProjects = mockProjects.filter((p) =>
        p.assignedWorkers.includes(currentUser?.id || ""),
      );
      const workerLogs = mockWorkLogs.filter(
        (l) => l.workerId === currentUser?.id,
      );
      const totalEarnings = workerLogs.reduce((sum, l) => sum + l.earnings, 0);
      const thisMonthLogs = workerLogs.filter((l) => {
        const logDate = new Date(l.date);
        const now = new Date();
        return (
          logDate.getMonth() === now.getMonth() &&
          logDate.getFullYear() === now.getFullYear()
        );
      });

      return {
        title: "My Work Dashboard",
        stats: [
          {
            label: "Assigned Projects",
            value: workerProjects.length,
            icon: "🏗️",
          },
          {
            label: "Total Earnings",
            value: `$${totalEarnings.toLocaleString()}`,
            icon: "💰",
          },
          { label: "Work Logs", value: workerLogs.length, icon: "📝" },
          { label: "This Month", value: thisMonthLogs.length, icon: "📅" },
        ],
        recentProjects: workerProjects.slice(0, 2),
      };
    }

    if (isSupplier) {
      const lowStockMaterials = mockMaterials.filter(
        (m) => m.remainingQuantity / m.totalQuantity < 0.2,
      );
      const totalDelivered = mockMaterials.reduce(
        (sum, m) => sum + m.usedQuantity * m.pricePerUnit,
        0,
      );

      return {
        title: "Supply Management",
        stats: [
          {
            label: "Materials Managed",
            value: mockMaterials.length,
            icon: "📦",
          },
          {
            label: "Low Stock Alerts",
            value: lowStockMaterials.length,
            icon: "⚠️",
          },
          {
            label: "Total Delivered",
            value: `$${totalDelivered.toLocaleString()}`,
            icon: "🚚",
          },
          {
            label: "Active Projects",
            value: mockProjects.filter((p) => p.status === "active").length,
            icon: "🏗️",
          },
        ],
        recentProjects: mockProjects
          .filter((p) => p.status === "active")
          .slice(0, 2),
      };
    }

    return { title: "Dashboard", stats: [], recentProjects: [] };
  };

  const dashboardData = getDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome back, {currentUser?.name?.split(" ")[0]}!
              </h1>
              <p className="text-sm text-gray-600">{dashboardData.title}</p>
            </div>
            <div className="text-2xl">{currentUser?.avatar}</div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {dashboardData.stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role-specific quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isEmployer && (
              <>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/projects")}
                >
                  <span className="mr-2">🏗️</span>
                  Manage Projects
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/add-entry")}
                >
                  <span className="mr-2">➕</span>
                  Add Work Entry
                </Button>
              </>
            )}

            {isWorker && (
              <>
                <Button
                  className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => navigate("/add-entry")}
                >
                  <span className="mr-2">📝</span>
                  Log Today's Work
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/projects")}
                >
                  <span className="mr-2">👁️</span>
                  View My Projects
                </Button>
              </>
            )}

            {isSupplier && (
              <>
                <Button
                  className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => navigate("/add-entry")}
                >
                  <span className="mr-2">🚚</span>
                  Log Material Delivery
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/materials")}
                >
                  <span className="mr-2">📦</span>
                  Material Inventory
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        {dashboardData.recentProjects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {isWorker ? "My Projects" : "Recent Projects"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/projects")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {dashboardData.recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Low Stock Alert for Suppliers */}
        {isSupplier && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>⚠️</span>
                Material Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockMaterials
                .filter((m) => m.remainingQuantity / m.totalQuantity < 0.2)
                .slice(0, 3)
                .map((material) => (
                  <div
                    key={material.id}
                    className="flex justify-between items-center py-2 border-b border-orange-200 last:border-b-0"
                  >
                    <div>
                      <div className="font-medium">{material.name}</div>
                      <div className="text-sm text-orange-700">
                        Only {material.remainingQuantity} {material.unit}{" "}
                        remaining
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-orange-200 text-orange-800"
                    >
                      Low Stock
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Demo Role Switcher */}
        <UserRoleSelector />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
