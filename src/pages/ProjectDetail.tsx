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

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isEmployer, isWorker } = useUserRole();

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

  const statusConfig = projectStatuses.find((s) => s.value === project.status);
  const progressPercentage = (project.completedArea / project.totalArea) * 100;
  const budgetUsed = (project.spentAmount / project.budget) * 100;

  const projectWorkLogs = mockWorkLogs.filter(
    (l) => l.projectId === project.id,
  );
  const projectWorkers = mockWorkers.filter((w) =>
    project.assignedWorkers.includes(w.id),
  );
  const projectMaterials = mockMaterials.filter((m) =>
    // Simulate materials assigned to this project
    project.id === "proj-1"
      ? ["mat-1", "mat-2", "mat-3"].includes(m.id)
      : project.id === "proj-2"
        ? ["mat-2", "mat-4"].includes(m.id)
        : ["mat-1", "mat-3"].includes(m.id),
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/projects")}
            >
              ← Back
            </Button>
            <Badge className={`${statusConfig?.color} text-white border-0`}>
              {statusConfig?.label}
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {project.name}
          </h1>
          <p className="text-sm text-gray-600">{project.description}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span className="font-semibold">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{project.completedArea} m² done</span>
                <span>{project.totalArea} m² total</span>
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Budget Used</span>
                <span className="font-semibold">{Math.round(budgetUsed)}%</span>
              </div>
              <Progress value={budgetUsed} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${project.spentAmount.toLocaleString()}</span>
                <span>${project.budget.toLocaleString()}</span>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-xs text-gray-500">Start Date</div>
                <div className="font-medium">
                  {new Date(project.startDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">End Date</div>
                <div className="font-medium">
                  {new Date(project.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-500">Location</div>
                <div className="font-medium flex items-center gap-1">
                  <span>📍</span>
                  {project.location}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for detailed information */}
        <Tabs defaultValue="work" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="work">Work Logs</TabsTrigger>
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
          </TabsList>

          {/* Work Logs Tab */}
          <TabsContent value="work" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Work Logs</CardTitle>
                  {isWorker && (
                    <Button
                      size="sm"
                      onClick={() => navigate("/add-entry")}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      + Add Work
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {projectWorkLogs.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-2xl mb-2">📝</div>
                    <div>No work logs yet</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projectWorkLogs.slice(0, 10).map((log) => (
                      <div
                        key={log.id}
                        className="border-l-4 border-emerald-500 pl-3 py-2"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium">{log.workerName}</div>
                          <div className="text-sm font-semibold text-emerald-600">
                            +${log.earnings}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {log.areaCompleted} m² completed on{" "}
                          {new Date(log.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Workers</CardTitle>
              </CardHeader>
              <CardContent>
                {projectWorkers.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-2xl mb-2">👷‍♂️</div>
                    <div>No workers assigned</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projectWorkers.map((worker) => {
                      const workerLogs = projectWorkLogs.filter(
                        (l) => l.workerId === worker.id,
                      );
                      const workerEarnings = workerLogs.reduce(
                        (sum, l) => sum + l.earnings,
                        0,
                      );
                      const workerArea = workerLogs.reduce(
                        (sum, l) => sum + l.areaCompleted,
                        0,
                      );

                      return (
                        <div
                          key={worker.id}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{worker.name}</div>
                              <div className="text-sm text-gray-600">
                                {worker.specialization}
                              </div>
                            </div>
                            <Badge variant="outline">
                              ${worker.ratePerSquareMeter}/m²
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="text-gray-500">
                                Area Completed
                              </div>
                              <div className="font-medium">{workerArea} m²</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Total Earned</div>
                              <div className="font-medium text-emerald-600">
                                ${workerEarnings.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Materials</CardTitle>
              </CardHeader>
              <CardContent>
                {projectMaterials.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-2xl mb-2">📦</div>
                    <div>No materials tracked</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projectMaterials.map((material) => {
                      const usagePercentage =
                        (material.usedQuantity / material.totalQuantity) * 100;

                      return (
                        <div
                          key={material.id}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{material.name}</div>
                              <div className="text-sm text-gray-600">
                                {material.supplier}
                              </div>
                            </div>
                            <Badge
                              variant={
                                material.remainingQuantity <
                                material.totalQuantity * 0.2
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {material.remainingQuantity} {material.unit} left
                            </Badge>
                          </div>
                          <div className="mb-2">
                            <Progress value={usagePercentage} className="h-2" />
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <div className="text-gray-500">Used</div>
                              <div className="font-medium">
                                {material.usedQuantity} {material.unit}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Total</div>
                              <div className="font-medium">
                                {material.totalQuantity} {material.unit}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Cost/Unit</div>
                              <div className="font-medium">
                                ${material.pricePerUnit}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        {(isWorker || isEmployer) && project.status === "active" && (
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="text-emerald-700 font-medium">
                  Quick Actions for this Project
                </div>
                <div className="space-y-2">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => navigate("/add-entry")}
                  >
                    <span className="mr-2">📝</span>
                    Log Work Entry
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-emerald-200"
                    onClick={() => navigate("/add-entry")}
                  >
                    <span className="mr-2">📦</span>
                    Log Material Usage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProjectDetail;
