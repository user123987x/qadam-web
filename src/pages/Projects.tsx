import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/ProjectCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useUserRole } from "@/hooks/useUserRole";
import { mockProjects, projectStatuses } from "@/lib/constants";
import { Project } from "@/lib/types";

const Projects = () => {
  const { currentUser, isWorker } = useUserRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter projects based on user role
  const getFilteredProjects = (): Project[] => {
    let projects = mockProjects;

    // Filter by user role
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
    planning: filteredProjects.filter((p) => p.status === "planning").length,
    completed: filteredProjects.filter((p) => p.status === "completed").length,
    paused: filteredProjects.filter((p) => p.status === "paused").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {isWorker ? "My Projects" : "All Projects"}
            </h1>
            <div className="text-lg">🏗️</div>
          </div>

          {/* Search */}
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Project Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {projectCounts.all}
                </div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {projectCounts.active}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {projectCounts.planning}
                </div>
                <div className="text-sm text-gray-600">Planning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {projectCounts.completed}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Tabs */}
        <Tabs
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full h-auto p-1">
            <TabsTrigger value="all" className="text-xs px-2 py-2">
              All
              {projectCounts.all > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs h-5 px-1">
                  {projectCounts.all}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs px-2 py-2">
              Active
              {projectCounts.active > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs h-5 px-1">
                  {projectCounts.active}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="planning" className="text-xs px-2 py-2">
              Planning
              {projectCounts.planning > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs h-5 px-1">
                  {projectCounts.planning}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs px-2 py-2">
              Done
              {projectCounts.completed > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs h-5 px-1">
                  {projectCounts.completed}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="paused" className="text-xs px-2 py-2">
              Paused
              {projectCounts.paused > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs h-5 px-1">
                  {projectCounts.paused}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {["all", "active", "planning", "completed", "paused"].map(
              (status) => (
                <TabsContent key={status} value={status} className="mt-0">
                  <div className="space-y-4">
                    {getProjectsByStatus(status).length === 0 ? (
                      <Card>
                        <CardContent className="text-center py-8">
                          <div className="text-4xl mb-2">📭</div>
                          <div className="text-gray-600">
                            {status === "all"
                              ? "No projects found"
                              : `No ${status} projects`}
                          </div>
                          {searchTerm && (
                            <div className="text-sm text-gray-500 mt-1">
                              Try adjusting your search terms
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      getProjectsByStatus(status).map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))
                    )}
                  </div>
                </TabsContent>
              ),
            )}
          </div>
        </Tabs>

        {/* Quick Actions for Workers */}
        {isWorker && projectCounts.active > 0 && (
          <Card className="mt-6 bg-emerald-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-emerald-700 font-medium mb-2">
                  Ready to log work?
                </div>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => (window.location.href = "/add-entry")}
                >
                  <span className="mr-2">📝</span>
                  Log Today's Work
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Projects;
