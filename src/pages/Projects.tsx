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
import {
  ProjectIcon,
  TrendingUpIcon,
  CheckIcon,
  DollarIcon,
  FileTextIcon,
} from "@/components/ui/icons";

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
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="glass-effect sticky top-0 z-10 border-b border-white/20">
        <div className="px-6 py-4 max-w-md mx-auto w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-soft-green to-deep-blue rounded-xl flex items-center justify-center shadow-medium">
              <ProjectIcon size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-neutral-800">
                {isWorker ? "My Projects" : "All Projects"}
              </h1>
              <p className="text-sm text-neutral-600">
                {isWorker
                  ? "Your assigned construction projects"
                  : "Manage all construction projects"}
              </p>
            </div>
          </div>

          {/* Search */}
          <Input
            placeholder="Search projects, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="px-6 py-4 space-y-6 max-w-md mx-auto w-full">
        {/* Project Stats */}
        <div className="app-card-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-neutral-800">
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                  <ProjectIcon size={24} className="text-deep-blue" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-neutral-800">
                    {projectCounts.all}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    Total Projects
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                  <TrendingUpIcon size={24} className="text-soft-green" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-neutral-800">
                    {projectCounts.active}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    Active
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                  <FileTextIcon size={24} className="text-deep-blue" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-neutral-800">
                    {projectCounts.planning}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    Planning
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                  <CheckIcon size={24} className="text-neutral-600" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-neutral-800">
                    {projectCounts.completed}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Project Tabs */}
        <Tabs
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full h-auto p-1 bg-white border border-neutral-200">
            <TabsTrigger
              value="all"
              className="text-xs px-2 py-3 data-[state=active]:bg-soft-green data-[state=active]:text-white"
            >
              All
              {projectCounts.all > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs h-5 px-1 bg-neutral-100 text-neutral-600"
                >
                  {projectCounts.all}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="text-xs px-2 py-3 data-[state=active]:bg-soft-green data-[state=active]:text-white"
            >
              Active
              {projectCounts.active > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs h-5 px-1 bg-neutral-100 text-neutral-600"
                >
                  {projectCounts.active}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="planning"
              className="text-xs px-2 py-3 data-[state=active]:bg-soft-green data-[state=active]:text-white"
            >
              Planning
              {projectCounts.planning > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs h-5 px-1 bg-neutral-100 text-neutral-600"
                >
                  {projectCounts.planning}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-xs px-2 py-3 data-[state=active]:bg-soft-green data-[state=active]:text-white"
            >
              Done
              {projectCounts.completed > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs h-5 px-1 bg-neutral-100 text-neutral-600"
                >
                  {projectCounts.completed}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="paused"
              className="text-xs px-2 py-3 data-[state=active]:bg-soft-green data-[state=active]:text-white"
            >
              Paused
              {projectCounts.paused > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs h-5 px-1 bg-neutral-100 text-neutral-600"
                >
                  {projectCounts.paused}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {["all", "active", "planning", "completed", "paused"].map(
              (status) => (
                <TabsContent key={status} value={status} className="mt-0">
                  <div className="space-y-4">
                    {getProjectsByStatus(status).length === 0 ? (
                      <div className="app-card">
                        <CardContent className="text-center py-12">
                          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center mb-4">
                            <ProjectIcon
                              size={28}
                              className="text-neutral-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-neutral-700">
                              {status === "all"
                                ? "No projects found"
                                : `No ${status} projects`}
                            </div>
                            {searchTerm && (
                              <div className="text-sm text-neutral-500">
                                Try adjusting your search terms
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </div>
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
          <div className="app-card bg-gradient-to-br from-soft-green/5 to-deep-blue/5 border-soft-green/20">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-soft-green to-deep-blue rounded-2xl flex items-center justify-center mb-4">
                <FileTextIcon size={28} className="text-white" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-neutral-800 mb-1">
                    Ready to log work?
                  </div>
                  <div className="text-sm text-neutral-600">
                    Track your daily progress and earnings
                  </div>
                </div>
                <Button
                  className="btn-primary"
                  onClick={() => (window.location.href = "/add-entry")}
                >
                  <FileTextIcon size={20} className="mr-2" />
                  Log Today's Work
                </Button>
              </div>
            </CardContent>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Projects;
