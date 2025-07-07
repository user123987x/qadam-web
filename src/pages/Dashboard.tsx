import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProjectCard } from "@/components/ProjectCard";
import { UserRoleSelector } from "@/components/UserRoleSelector";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";
import { useUserRole } from "@/hooks/useUserRole";
import {
  mockProjects,
  mockWorkLogs,
  mockMaterials,
  mockMaterialRequests,
} from "@/lib/constants";
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
  TruckIcon,
} from "@/components/ui/icons";
import {WorkerProjectCard} from "@/components/WorkerProjectCard.tsx";

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
      const pendingRequests = mockMaterialRequests.filter(
        (r) => r.status === "pending",
      ).length;

      return {
        title: "Обзор проектов",
        pendingRequests,
        stats: [
          {
            label: "Всего проектов",
            value: mockProjects.length || 0,
            icon: ProjectIcon,
            color: "text-deep-blue",
          },
          {
            label: "Активные проекты",
            value: activeProjects.length || 0,
            icon: TrendingUpIcon,
            color: "text-soft-green",
          },
          {
            label: "Завершенные",
            value: completedProjects.length || 0,
            icon: CheckIcon,
            color: "text-neutral-600",
          },
          {
            label: "Заявки в ожидании",
            value: pendingRequests || 0,
            icon: AlertIcon,
            color: "text-orange-600",
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
      const myRequests = mockMaterialRequests.filter(
        (r) => r.workerId === currentUser?.id,
      );
      const pendingRequests = myRequests.filter(
        (r) => r.status === "pending",
      ).length;

      return {
        title: "Рабочая панель",
        pendingRequests,
        stats: [
          {
            label: "Назначенные проекты",
            value: workerProjects.length || 0,
            icon: ProjectIcon,
            color: "text-deep-blue",
          },
          {
            label: "Общий заработок",
            value: `$${(totalEarnings || 0).toLocaleString()}`,
            icon: DollarIcon,
            color: "text-soft-green",
          },
          {
            label: "Записи работ",
            value: workerLogs.length || 0,
            icon: FileTextIcon,
            color: "text-neutral-600",
          },
          {
            label: "Заявки в ожидании",
            value: pendingRequests || 0,
            icon: AlertIcon,
            color: "text-orange-600",
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
      const pendingRequests = mockMaterialRequests.filter(
        (r) => r.status === "pending" || r.status === "approved",
      ).length;

      return {
        title: "Управление поставками",
        pendingRequests,
        stats: [
          {
            label: "Управляемые материалы",
            value: mockMaterials.length || 0,
            icon: MaterialIcon,
            color: "text-deep-blue",
          },
          {
            label: "Предупреждения о нехватке",
            value: lowStockMaterials.length || 0,
            icon: AlertIcon,
            color: "text-orange-600",
          },
          {
            label: "Всего поставлено",
            value: `${(totalDelivered || 0).toLocaleString()} TJS`,
            icon: DollarIcon,
            color: "text-soft-green",
          },
          {
            label: "Заявки на материалы",
            value: pendingRequests || 0,
            icon: AlertIcon,
            color: "text-orange-600",
          },
        ],
        recentProjects: mockProjects
          .filter((p) => p.status === "active")
          .slice(0, 2),
      };
    }

    return {
      title: "Dashboard",
      pendingRequests: 0,
      stats: [],
      recentProjects: [],
    };
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
      <div className="bg-white/95 backdrop-blur-lg border-b border-neutral-200/60 sticky top-0 z-10">
        <div className="px-6 py-4 max-w-md mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <ProfilePhotoUpload size="md" className="shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-neutral-800 truncate">
                  Добро пожаловать, {currentUser?.name?.split(" ")[0]}
                </h1>
                <p className="text-sm text-neutral-600 truncate">
                  {dashboardData.title}
                </p>
              </div>
            </div>
            <Badge
              className={`${getRoleColor()} bg-white border border-neutral-200 shadow-soft px-3 py-1 shrink-0`}
            >
              {userRole === "employer"
                ? "Работодатель"
                : userRole === "worker"
                  ? "Рабочий"
                  : userRole === "supplier"
                    ? "Поставщик"
                    : "Пользователь"}
            </Badge>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 space-y-6 max-w-md mx-auto w-full">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {dashboardData.stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="app-card text-center">
                <CardContent className="p-5">
                  <div className="space-y-2.5">
                    <div
                      className={`w-11 h-11 mx-auto bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center shadow-sm`}
                    >
                      <IconComponent size={20} className={stat.color} />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-neutral-800 leading-tight">
                        {stat.value}
                      </div>
                      <div className="text-xs text-neutral-600 font-medium mt-0.5">
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
              Быстрые действия
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isEmployer && (
              <>
                <Button
                  className="btn-outline w-full h-11 justify-start"
                  onClick={() => navigate("/projects")}
                >
                  <ProjectIcon size={18} className="mr-2.5" />
                  <span className="font-medium">Управление проектами</span>
                </Button>
                <Button
                  className="btn-primary w-full h-11 justify-start"
                  onClick={() => navigate("/add-entry")}
                >
                  <FileTextIcon size={18} className="mr-2.5" />
                  <span className="font-medium">Добавить запись работы</span>
                </Button>
                {dashboardData.pendingRequests > 0 && (
                  <Button
                    className="btn-outline w-full h-11 justify-start border-orange-200 text-orange-700"
                    onClick={() => navigate("/materials")}
                  >
                    <AlertIcon size={18} className="mr-2.5 text-orange-600" />
                    <span className="font-medium">
                      Рассмотреть заявки ({dashboardData.pendingRequests})
                    </span>
                  </Button>
                )}
              </>
            )}

            {isWorker && (
              <>
                <Button
                  className="btn-primary w-full h-11 justify-start"
                  onClick={() => navigate("/add-entry")}
                >
                  <FileTextIcon size={18} className="mr-2.5" />
                  <span className="font-medium">
                    Записать сегодняшнюю работу
                  </span>
                </Button>
                <Button
                  className="btn-outline w-full h-11 justify-start"
                  onClick={() => navigate("/projects")}
                >
                  <ProjectIcon size={18} className="mr-2.5" />
                  <span className="font-medium">Просмотреть мои проекты</span>
                </Button>
                <Button
                  className="btn-outline w-full h-11 justify-start"
                  onClick={() => navigate("/add-entry?tab=request")}
                >
                  <MaterialIcon size={18} className="mr-2.5" />
                  <span className="font-medium">Запросить материалы</span>
                </Button>
              </>
            )}

            {isSupplier && (
              <>
                <Button
                  className="btn-primary w-full h-11 justify-start"
                  onClick={() => navigate("/add-entry")}
                >
                  <MaterialIcon size={18} className="mr-2.5" />
                  <span className="font-medium">
                    Записать поставку материалов
                  </span>
                </Button>
                <Button
                  className="btn-outline w-full h-11 justify-start"
                  onClick={() => navigate("/materials")}
                >
                  <TruckIcon size={18} className="mr-2.5 text-deep-blue" />
                  <span className="font-medium">Управление складом</span>
                </Button>
              </>
            )}

            {isSupplier && (
              <>
                <Button
                  className="btn-primary w-full h-11 justify-start"
                  onClick={() => navigate("/add-entry")}
                >
                  <MaterialIcon size={18} className="mr-2.5" />
                  <span className="font-medium">Добавить поставку</span>
                </Button>
                <Button
                  className="btn-outline w-full h-11 justify-start"
                  onClick={() => navigate("/materials")}
                >
                  <TruckIcon size={18} className="mr-2.5 text-deep-blue" />
                  <span className="font-medium">Контроль остатков</span>
                </Button>
              </>
            )}
          </CardContent>
        </div>

        {/* Recent Projects */}
        {dashboardData.recentProjects.length > 0 && (
          <div className="space-y-4">
            {isWorker && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-neutral-800">
                    {isWorker ? "Мои проекты" : "Недавние проекты"}
                  </h2>
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/projects")}
                      className="btn-ghost text-soft-green hover:text-soft-green-light"
                  >
                    Посмотреть все
                  </Button>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentProjects.map((project) => (
                      <WorkerProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </>
            )}

            {isEmployer && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-neutral-800">
                      {isWorker ? "Мои проекты" : "Недавние проекты"}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/projects")}
                        className="btn-ghost text-soft-green hover:text-soft-green-light"
                    >
                      Посмотреть все
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {dashboardData.recentProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </>
            )}

            {isSupplier && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-neutral-800">
                      {isWorker ? "Мои проекты" : "Недавние проекты"}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/projects")}
                        className="btn-ghost text-soft-green hover:text-soft-green-light"
                    >
                      Посмотреть все
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {dashboardData.recentProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </>
            )}
          </div>
        )}

        {/* Low Stock Alert for Suppliers */}
        {isSupplier && (
          <div className="app-card border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-orange-800 flex items-center gap-2">
                <AlertIcon size={18} />
                Предупреждения о материалах
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
                          Осталось только {material.remainingQuantity}{" "}
                          {material.unit}
                        </div>
                      </div>
                      <Badge className="bg-orange-200 text-orange-800 border-orange-300">
                        Мало в наличии
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </div>
        )}

        {/* Demo Role Switcher */}
        {/*<UserRoleSelector />*/}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
