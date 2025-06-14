import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useUserRole } from "@/hooks/useUserRole";
import {
  mockProjects,
  mockWorkLogs,
  mockMaterials,
  mockWorkers,
  projectStatuses,
} from "@/lib/constants";
import {
  CalendarIcon,
  MapPinIcon,
  DollarIcon,
  TrendingUpIcon,
  UserIcon,
  MaterialIcon,
  FileTextIcon,
  ArrowLeftIcon,
} from "@/components/ui/icons";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isEmployer, isWorker } = useUserRole();

  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-xl font-semibold mb-2">Project Not Found</div>
          <Button onClick={() => navigate("/projects")}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  // Check if worker has access to this project
  if (isWorker && !project.assignedWorkers.includes(currentUser?.id || "")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <div className="text-xl font-semibold mb-2">Access Denied</div>
          <div className="text-gray-600 mb-4">
            You don't have access to this project
          </div>
          <Button onClick={() => navigate("/projects")}>
            Back to My Projects
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = projectStatuses.find((s) => s.value === project.status);
  const progressPercentage = (project.completedArea / project.totalArea) * 100;

  // Get filtered data based on user role
  const getProjectData = () => {
    if (isWorker) {
      // Workers only see their own data
      const myWorkLogs = mockWorkLogs.filter(
        (l) => l.projectId === project.id && l.workerId === currentUser?.id,
      );
      const myTotalEarnings = myWorkLogs.reduce(
        (sum, log) => sum + log.earnings,
        0,
      );
      const myAreaCompleted = myWorkLogs.reduce(
        (sum, log) => sum + log.areaCompleted,
        0,
      );

      return {
        workLogs: myWorkLogs,
        totalEarnings: myTotalEarnings,
        areaCompleted: myAreaCompleted,
        workers: [currentUser], // Only show themselves
        materials: [], // Workers don't see material details
      };
    } else {
      // Employers see everything
      const projectWorkLogs = mockWorkLogs.filter(
        (l) => l.projectId === project.id,
      );
      const projectWorkers = mockWorkers.filter((w) =>
        project.assignedWorkers.includes(w.id),
      );
      const projectMaterials = mockMaterials; // Simplified for demo

      return {
        workLogs: projectWorkLogs,
        workers: projectWorkers,
        materials: projectMaterials,
      };
    }
  };

  const projectData = getProjectData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/projects")}
              className="p-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {project.name}
              </h1>
              <p className="text-sm text-gray-600">
                {isWorker ? "Мои работы" : "Обзор проекта"}
              </p>
            </div>
            <Badge className={`${statusConfig?.color} text-white border-0`}>
              {statusConfig?.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Project Info */}
        <Card className="app-card">
          <CardHeader>
            <CardTitle className="text-lg">
              {isWorker ? "Информация о проекте" : "Обзор проекта"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{project.description}</p>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Адрес:</span>
                <span className="font-medium">{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Таймлайн:</span>
                <span className="font-medium">
                  {formatDate(project.startDate)} -{" "}
                  {formatDate(project.endDate)}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {isWorker ? "Project Progress" : "Общий прогресс"}
                </span>
                <span className="font-medium">
                  {project.completedArea} / {project.totalArea} м²
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="text-xs text-gray-500">
                {progressPercentage.toFixed(1)}% выполнено
              </div>
            </div>

            {/* Worker-specific progress */}
            {isWorker && (
              <div className="pt-3 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Мой вклад</span>
                    <span className="font-medium text-green-600">
                      {projectData.areaCompleted} м²
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {project.totalArea > 0
                      ? (
                          (projectData.areaCompleted / project.totalArea) *
                          100
                        ).toFixed(1)
                      : 0}
                    % от общего проекта
                  </div>
                </div>
              </div>
            )}

            {/* Budget (Employers only) */}
            {isEmployer && (
              <div className="pt-3 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Остаток бюджета</span>
                    <span className="font-medium">
                      {project.spentAmount?.toLocaleString()} TJS / 
                      {project.budget?.toLocaleString()} TJS
                    </span>
                  </div>
                  <Progress
                    value={
                      ((project.spentAmount || 0) / (project.budget || 1)) * 100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for different content */}
        <Tabs defaultValue="work-logs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="work-logs" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              {isWorker ? "Моя работа" : "Журнал работы"}
            </TabsTrigger>
            {isEmployer ? (
              <TabsTrigger value="team" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Бригада
              </TabsTrigger>
            ) : (
              <TabsTrigger value="earnings" className="flex items-center gap-2">
                <DollarIcon className="h-4 w-4" />
                Доходы
              </TabsTrigger>
            )}
          </TabsList>

          {/* Work Logs Tab */}
          <TabsContent value="work-logs" className="mt-6">
            <Card className="app-card">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isWorker ? "Мои рабочие журналы" : "Прогресс"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projectData.workLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📝</div>
                    <div className="text-gray-600">
                      {isWorker ? "No work logged yet" : "No work logs found"}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectData.workLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{log.description}</div>
                            {!isWorker && (
                              <div className="text-sm text-gray-600">
                                от {log.workerName}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              {log.earnings}c
                            </div>
                            <div className="text-xs text-gray-500">
                              {log.areaCompleted} м²
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(log.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab (Employers) / Earnings Tab (Workers) */}
          <TabsContent
            value={isEmployer ? "team" : "earnings"}
            className="mt-6"
          >
            <Card className="app-card">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isEmployer ? "Участники команды" : "Мой доход"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEmployer ? (
                  <div className="space-y-3">
                    {projectData.workers.map((worker) => (
                      <div
                        key={worker.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <div className="font-medium">{worker.name}</div>
                          <div className="text-sm text-gray-600">
                            {worker.specialization}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {worker.ratePerSquareMeter}/м²
                          </div>
                          <div className="text-xs text-gray-500">
                            {worker.phone}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {projectData.totalEarnings?.toLocaleString()} TJS
                        </div>
                        <div className="text-sm text-green-700 font-medium">
                          Общий заработок с проекта
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-800">
                          {projectData.workLogs.length}
                        </div>
                        <div className="text-xs text-gray-600">
                          Рабочие сессии
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-800">
                          {projectData.areaCompleted} м²
                        </div>
                        <div className="text-xs text-gray-600">
                          Площадь завершена
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="space-y-3">
          {isWorker && (
            <>
              <Button
                className="w-full h-12"
                onClick={() => navigate("/add-entry")}
              >
                <FileTextIcon className="h-4 w-4 mr-2" />
                Добавить работу
              </Button>
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => navigate("/add-entry?tab=request")}
              >
                <MaterialIcon className="h-4 w-4 mr-2" />
                Запросить материалы
              </Button>
            </>
          )}
          {isEmployer && (
            <Button
              className="w-full h-12"
              onClick={() => navigate("/add-entry")}
            >
              <TrendingUpIcon className="h-4 w-4 mr-2" />
              Управление проектом
            </Button>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProjectDetail;
