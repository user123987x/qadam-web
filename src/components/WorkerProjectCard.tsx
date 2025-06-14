import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Project } from "@/lib/types";
import { projectStatuses, mockWorkLogs } from "@/lib/constants";
import { useUserRole } from "@/hooks/useUserRole";
import {
  CalendarIcon,
  MapPinIcon,
  FileTextIcon,
  DollarIcon,
  TrendingUpIcon,
} from "@/components/ui/icons";

interface WorkerProjectCardProps {
  project: Project;
}

export const WorkerProjectCard = ({ project }: WorkerProjectCardProps) => {
  const navigate = useNavigate();
  const { currentUser } = useUserRole();

  // Get only worker's work logs for this project
  const myWorkLogs = mockWorkLogs.filter(
    (log) => log.projectId === project.id && log.workerId === currentUser?.id,
  );

  const myTotalEarnings = myWorkLogs.reduce(
    (sum, log) => sum + log.earnings,
    0,
  );
  const myAreaCompleted = myWorkLogs.reduce(
    (sum, log) => sum + log.areaCompleted,
    0,
  );
  const myProgressPercentage =
    project.totalArea > 0 ? (myAreaCompleted / project.totalArea) * 100 : 0;

  const statusConfig = projectStatuses.find((s) => s.value === project.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className="app-card cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {project.name}
            </CardTitle>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          </div>
          <Badge className={`${statusConfig?.color} text-white border-0 ml-3`}>
            {statusConfig?.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location and Timeline */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Адрес:</span>
            <span className="font-medium">{project.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Таймлайн:</span>
            <span className="font-medium">
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </span>
          </div>
        </div>

        {/* My Progress Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Прогресс
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Моя завершенная область</span>
              <span className="font-medium">
                {myAreaCompleted} / {project.totalArea} м²
              </span>
            </div>
            <Progress value={myProgressPercentage} className="h-2" />
            <div className="text-xs text-gray-500">
              {myProgressPercentage.toFixed(1)}% общей площади проекта
            </div>
          </div>
        </div>

        {/* My Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <DollarIcon className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Мой доход</div>
              <div className="font-semibold text-green-600">
                ${myTotalEarnings.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Журнал работы</div>
              <div className="font-semibold text-blue-600">
                {myWorkLogs.length}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="w-full mt-4"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${project.id}`);
          }}
        >
          <TrendingUpIcon className="h-4 w-4 mr-2" />
          Мои рабочие данные
        </Button>
      </CardContent>
    </Card>
  );
};
