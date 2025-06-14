import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/ProjectCard";
import { WorkerProjectCard } from "@/components/WorkerProjectCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useUserRole } from "@/hooks/useUserRole";
import { mockProjects, projectStatuses } from "@/lib/constants";
import { Project } from "@/lib/types";
import {
  ProjectIcon,
  TrendingUpIcon,
  CheckIcon,
  DollarIcon,
  FileTextIcon,
} from "@/components/ui/icons";

const Projects = () => {
  const { currentUser, isWorker, isEmployer } = useUserRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter projects based on user role
  const getFilteredProjects = (): Project[] => {
    let projects = mockProjects;

    // Filter by user role - workers only see their assigned projects
    if (isWorker) {
      projects = projects.filter((p) =>
        p.assignedWorkers.includes(currentUser?.id || ""),
      );
    }

    // Filter by search term
    if (searchTerm) {
      projects = projects.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      projects = projects.filter((p) => p.status === selectedStatus);
    }

    return projects;
  };

  const filteredProjects = getFilteredProjects();

  const getProjectsByStatus = (status: string) => {
    if (status === "all") return filteredProjects;
    return filteredProjects.filter((p) => p.status === status);
  };

  const projectCounts = {
    all: filteredProjects.length,
    active: filteredProjects.filter((p) => p.status === "active").length,
    completed: filteredProjects.filter((p) => p.status === "completed").length,
    planning: filteredProjects.filter((p) => p.status === "planning").length,
    paused: filteredProjects.filter((p) => p.status === "paused").length,
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {isWorker ? "My Projects" : "Projects"}
            </h1>
            <div className="text-lg">{isWorker ? "👷‍♂️" : "📁"}</div>
          </div>

          {/* Search */}
          <Input
            placeholder={
              isWorker ? "Search my projects..." : "Search projects..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="app-card text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <ProjectIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {projectCounts.all}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {isWorker ? "Assigned" : "Total Projects"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="app-card text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <TrendingUpIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {projectCounts.active}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Active Projects
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Tabs */}
        <Tabs
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full h-auto p-1">
            {[
              { key: "all", label: "All", count: projectCounts.all },
              { key: "active", label: "Active", count: projectCounts.active },
              {
                key: "completed",
                label: "Done",
                count: projectCounts.completed,
              },
              { key: "planning", label: "Plan", count: projectCounts.planning },
              { key: "paused", label: "Pause", count: projectCounts.paused },
            ].map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="text-xs px-2 py-2 flex flex-col gap-1"
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <Badge variant="secondary" className="text-xs h-4 px-1">
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            {[
              { status: "all", label: "All Projects" },
              { status: "active", label: "Active Projects" },
              { status: "completed", label: "Completed Projects" },
              { status: "planning", label: "Planning Projects" },
              { status: "paused", label: "Paused Projects" },
            ].map(({ status }) => (
              <TabsContent key={status} value={status} className="mt-0">
                <div className="space-y-4">
                  {getProjectsByStatus(status).length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <div className="text-4xl mb-2">📁</div>
                        <div className="text-gray-600">
                          {isWorker
                            ? `No ${status === "all" ? "" : status + " "}assigned projects found`
                            : `No ${status === "all" ? "" : status + " "}projects found`}
                        </div>
                        {searchTerm && (
                          <div className="text-sm text-gray-500 mt-1">
                            Try adjusting your search terms
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    getProjectsByStatus(status).map((project) => {
                      // Show different cards based on user role
                      if (isWorker) {
                        return (
                          <WorkerProjectCard
                            key={project.id}
                            project={project}
                          />
                        );
                      }
                      return <ProjectCard key={project.id} project={project} />;
                    })
                  )}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>

        {/* Worker-specific help text */}
        {isWorker && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-700">
              <div className="font-medium mb-2">💡 Worker View:</div>
              <ul className="space-y-1">
                <li>• You only see projects you're assigned to</li>
                <li>• View your personal progress and earnings</li>
                <li>• Click any project to log work or request materials</li>
                <li>• Your work data is private to you</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Projects;
