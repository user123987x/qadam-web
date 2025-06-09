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
import {
  ProjectIcon,
  TrendingUpIcon,
  DollarIcon,
  CheckIcon,
  FileTextIcon,
  MaterialIcon,
  AlertIcon,
  WorkerIcon,
  EmployerIcon,
  SupplierIcon,
} from "@/components/ui/icons";

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
      const totalBudget = mockProjects.reduce(
        (sum, p) => sum + (p.budget || 0),
        0,
      );
      const totalSpent = mockProjects.reduce(
        (sum, p) => sum + (p.spentAmount || 0),
        0,
      );

      return {
        title: "Project Overview",
        stats: [
          {
            label: "Total Projects",
            value: mockProjects.length || 0,
            icon: ProjectIcon,
            color: "text-deep-blue",
          },
          {
            label: "Active Projects",
            value: activeProjects.length || 0,
            icon: TrendingUpIcon,
            color: "text-soft-green",
          },
          {
            label: "Completed",
            value: completedProjects.length || 0,
            icon: CheckIcon,
            color: "text-neutral-600",
          },
          {
            label: "Budget Used",
            value: `${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%`,
            icon: DollarIcon,
            color: "text-deep-blue",
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
      const totalEarnings = workerLogs.reduce(
        (sum, l) => sum + (l.earnings || 0),
        0,
      );
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
            value: workerProjects.length || 0,
            icon: ProjectIcon,
            color: "text-deep-blue",
          },
          {
            label: "Total Earnings",
            value: `$${(totalEarnings || 0).toLocaleString()}`,
            icon: DollarIcon,
            color: "text-soft-green",
          },
          {
            label: "Work Logs",
            value: workerLogs.length || 0,
            icon: FileTextIcon,
            color: "text-neutral-600",
          },
          {
            label: "This Month",
            value: thisMonthLogs.length || 0,
            icon: TrendingUpIcon,
            color: "text-deep-blue",
          },
        ],
        recentProjects: workerProjects.slice(0, 2),
      };
    }

    if (isSupplier) {
      const lowStockMaterials = mockMaterials.filter((m) => {
        const remaining = m.remainingQuantity || 0;
        const total = m.totalQuantity || 1;
        return remaining / total < 0.2;
      });
      const totalDelivered = mockMaterials.reduce(
        (sum, m) => sum + (m.usedQuantity || 0) * (m.pricePerUnit || 0),
        0,
      );

      return {
        title: "Supply Management",
        stats: [
          {
            label: "Materials Managed",
            value: mockMaterials.length || 0,
            icon: MaterialIcon,
            color: "text-deep-blue",
          },
          {
            label: "Low Stock Alerts",
            value: lowStockMaterials.length || 0,
            icon: AlertIcon,
            color: "text-orange-600",
          },
          {
            label: "Total Delivered",
            value: `$${(totalDelivered || 0).toLocaleString()}`,
            icon: DollarIcon,
            color: "text-soft-green",
          },
          {
            label: "Active Projects",
            value:
              mockProjects.filter((p) => p.status === "active").length || 0,
            icon: ProjectIcon,
            color: "text-neutral-600",
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

  const getRoleIcon = () => {
    switch (userRole) {
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

  const getRoleColor = () => {
    switch (userRole) {
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

  const RoleIcon = getRoleIcon();

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="glass-effect sticky top-0 z-10 border-b border-white/20">
        <div className="px-6 py-4 max-w-md mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-soft-green to-deep-blue rounded-xl flex items-center justify-center shadow-medium shrink-0">
                <RoleIcon size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-neutral-800 truncate">
                  Welcome back, {currentUser?.name?.split(" ")[0]}
                </h1>
                <p className="text-sm text-neutral-600 truncate">
                  {dashboardData.title}
                </p>
              </div>
            </div>
            <Badge
              className={`${getRoleColor()} bg-white border shadow-soft px-3 py-1 shrink-0`}
            >
              {userRole
                ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
                : "User"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6 max-w-md mx-auto w-full">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          {dashboardData.stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="app-card text-center">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div
                      className={`w-12 h-12 mx-auto bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center`}
                    >
                      <IconComponent size={24} className={stat.color} />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-neutral-800">
                        {stat.value}
                      </div>
                      <div className="text-xs text-neutral-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="app-card-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-neutral-800">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEmployer && (
              <>
                <Button
                  className="btn-outline w-full h-12 justify-start"
                  onClick={() => navigate("/projects")}
                >
                  <ProjectIcon size={20} className="mr-3 text-deep-blue" />
                  <span className="font-medium">Manage Projects</span>
                </Button>
                <Button
                  className="btn-primary w-full h-12 justify-start"
                  onClick={() => navigate("/add-entry")}
                >
                  <FileTextIcon size={20} className="mr-3" />
                  <span className="font-medium">Add Work Entry</span>
                </Button>
              </>
            )}

            {isWorker && (
              <>
                <Button
                  className="btn-primary w-full h-12 justify-start"
                  onClick={() => navigate("/add-entry")}
                >
                  <FileTextIcon size={20} className="mr-3" />
                  <span className="font-medium">Log Today's Work</span>
                </Button>
                <Button
                  className="btn-outline w-full h-12 justify-start"
                  onClick={() => navigate("/projects")}
                >
                  <ProjectIcon size={20} className="mr-3 text-deep-blue" />
                  <span className="font-medium">View My Projects</span>
                </Button>
              </>
            )}

            {isSupplier && (
              <>
                <Button
                  className="btn-primary w-full h-12 justify-start"
                  onClick={() => navigate("/add-entry")}
                >
                  <MaterialIcon size={20} className="mr-3" />
                  <span className="font-medium">Log Material Delivery</span>
                </Button>
                <Button
                  className="btn-outline w-full h-12 justify-start"
                  onClick={() => navigate("/materials")}
                >
                  <MaterialIcon size={20} className="mr-3 text-deep-blue" />
                  <span className="font-medium">Material Inventory</span>
                </Button>
              </>
            )}
          </CardContent>
        </div>

        {/* Recent Projects */}
        {dashboardData.recentProjects.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-neutral-800">
                {isWorker ? "My Projects" : "Recent Projects"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/projects")}
                className="btn-ghost text-soft-green hover:text-soft-green-light"
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Low Stock Alert for Suppliers */}
        {isSupplier && (
          <div className="app-card border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-orange-800 flex items-center gap-2">
                <AlertIcon size={20} />
                Material Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockMaterials
                  .filter((m) => {
                    const total = m.totalQuantity || 1;
                    return m.remainingQuantity / total < 0.2;
                  })
                  .slice(0, 3)
                  .map((material) => (
                    <div
                      key={material.id}
                      className="flex justify-between items-center py-3 border-b border-orange-200 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-orange-800">
                          {material.name}
                        </div>
                        <div className="text-sm text-orange-700">
                          Only {material.remainingQuantity} {material.unit}{" "}
                          remaining
                        </div>
                      </div>
                      <Badge className="bg-orange-200 text-orange-800 border-orange-300">
                        Low Stock
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </div>
        )}

        {/* Demo Role Switcher */}
        <UserRoleSelector />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
