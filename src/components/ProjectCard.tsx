import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { projectStatuses } from "@/lib/constants";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const statusConfig = projectStatuses.find((s) => s.value === project.status);
  const progressPercentage =
    project.totalArea > 0
      ? (project.completedArea / project.totalArea) * 100
      : 0;
  const budgetUsed =
    project.budget > 0 ? (project.spentAmount / project.budget) * 100 : 0;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight mb-1">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          </div>
          <Badge className={`ml-2 ${statusConfig?.color} text-white border-0`}>
            {statusConfig?.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{project.completedArea} m² completed</span>
            <span>{project.totalArea} m² total</span>
          </div>
        </div>

        {/* Location and Dates */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{project.location}</span>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="text-gray-600">
            Start: {new Date(project.startDate).toLocaleDateString()}
          </div>
          <div className="text-gray-600">
            End: {new Date(project.endDate).toLocaleDateString()}
          </div>
        </div>

        {/* Budget Information */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Budget Used</span>
            <span className="font-medium">{Math.round(budgetUsed)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-emerald-600">
              ${project.spentAmount.toLocaleString()}
            </span>
            <span className="text-gray-600">
              / ${project.budget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Worker Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <span>👷‍♂️</span>
            Workers assigned
          </span>
          <span className="font-medium">{project.assignedWorkers.length}</span>
        </div>
      </CardContent>
    </Card>
  );
};
