import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { projectStatuses } from "@/lib/constants";
import {
  LocationIcon,
  CalendarIcon,
  DollarIcon,
  WorkerIcon,
} from "@/components/ui/icons";

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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "planning":
        return "status-planning";
      case "completed":
        return "status-completed";
      case "paused":
        return "status-paused";
      default:
        return "status-planning";
    }
  };

  return (
    <Card
      className="app-card cursor-pointer hover:shadow-medium transition-all duration-200 active:scale-[0.98]"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-neutral-800 leading-tight mb-2 line-clamp-1">
              {project.name}
            </h3>
            <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>
          <Badge className={getStatusStyles(project.status)}>
            {statusConfig?.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-neutral-700">
              Progress
            </span>
            <span className="text-sm font-semibold text-neutral-800">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="progress-bar h-2">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-500">
            <span>{project.completedArea} m² completed</span>
            <span>{project.totalArea} m² total</span>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <LocationIcon size={16} className="text-neutral-400" />
            <span className="text-sm text-neutral-600 truncate">
              {project.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <WorkerIcon size={16} className="text-neutral-400" />
            <span className="text-sm text-neutral-600">
              {project.assignedWorkers.length} workers
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-neutral-400" />
            <span>
              Start: {new Date(project.startDate).toLocaleDateString()}
            </span>
          </div>
          <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
        </div>

        {/* Budget Information */}
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <DollarIcon size={16} className="text-neutral-400" />
              Budget Used
            </span>
            <span className="text-sm font-semibold text-neutral-800">
              {Math.round(budgetUsed)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-soft-green">
              ${project.spentAmount.toLocaleString()}
            </span>
            <span className="text-sm text-neutral-600">
              / ${project.budget.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
