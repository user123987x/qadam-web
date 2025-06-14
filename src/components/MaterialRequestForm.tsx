import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockProjects, mockMaterials, urgencyLevels } from "@/lib/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";
import { AlertTriangleIcon, PackageIcon } from "@/components/ui/icons";

export const MaterialRequestForm = () => {
  const { currentUser } = useUserRole();
  const [formData, setFormData] = useState({
    projectId: "",
    materialName: "",
    requestedQuantity: "",
    unit: "",
    urgency: "",
    reason: "",
    notes: "",
  });

  // Get projects assigned to current worker
  const availableProjects = mockProjects.filter((p) =>
    p.assignedWorkers.includes(currentUser?.id || ""),
  );

  // Get unique materials from all projects
  const availableMaterials = Array.from(
    new Set(mockMaterials.map((m) => m.name)),
  ).map((materialName) => {
    const material = mockMaterials.find((m) => m.name === materialName);
    return {
      name: materialName,
      unit: material?.unit || "pcs",
      remainingQuantity: material?.remainingQuantity || 0,
    };
  });

  const selectedProject = mockProjects.find((p) => p.id === formData.projectId);
  const selectedMaterial = availableMaterials.find(
    (m) => m.name === formData.materialName,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.projectId ||
      !formData.materialName ||
      !formData.requestedQuantity ||
      !formData.urgency ||
      !formData.reason
    ) {
      toast({
        title: "Missing Information",
        description: "Пожалуйста, заполните все обязательные поля.",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseFloat(formData.requestedQuantity);
    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0.",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally send the request to your backend
    console.log("Material request submitted:", {
      ...formData,
      workerId: currentUser?.id,
      workerName: currentUser?.name,
      projectName: selectedProject?.name,
      requestDate: new Date().toISOString().split("T")[0],
      status: "pending",
    });

    toast({
      title: "Запрос отправлен",
      description: `Ваш запрос на ${formData.requestedQuantity} ${selectedMaterial?.unit} ${formData.materialName} был отправлен.`,
    });

    // Reset form
    setFormData({
      projectId: "",
      materialName: "",
      requestedQuantity: "",
      unit: "",
      urgency: "",
      reason: "",
      notes: "",
    });
  };

  const handleMaterialChange = (materialName: string) => {
    const material = availableMaterials.find((m) => m.name === materialName);
    setFormData({
      ...formData,
      materialName,
      unit: material?.unit || "",
    });
  };

  const getLowStockMaterials = () => {
    return availableMaterials.filter((m) => m.remainingQuantity < 100);
  };

  const lowStockMaterials = getLowStockMaterials();

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStockMaterials.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangleIcon className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-3">
              The following materials are running low:
            </p>
            <div className="flex flex-wrap gap-2">
              {lowStockMaterials.map((material) => (
                <Badge
                  key={material.name}
                  variant="outline"
                  className="border-yellow-300 text-yellow-800"
                >
                  {material.name}: {material.remainingQuantity} {material.unit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5" />
            Request Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="project">Project *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) =>
                  setFormData({ ...formData, projectId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите проект" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex flex-col">
                        <span>{project.name}</span>
                        <span className="text-sm text-gray-500">
                          {project.location}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Material Selection */}
            <div className="space-y-2">
              <Label htmlFor="material">Material *</Label>
              <Select
                value={formData.materialName}
                onValueChange={handleMaterialChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите материал" />
                </SelectTrigger>
                <SelectContent>
                  {availableMaterials.map((material) => (
                    <SelectItem key={material.name} value={material.name}>
                      <div className="flex justify-between items-center w-full">
                        <span>{material.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {material.remainingQuantity} {material.unit} remaining
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Needed *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.requestedQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requestedQuantity: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={selectedMaterial?.unit || formData.unit}
                  readOnly
                  placeholder="Сначала выберите материал"
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <Label htmlFor="urgency">Priority Level *</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) =>
                  setFormData({ ...formData, urgency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите приоритет" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${level.color}`}
                        />
                        {level.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Request *</Label>
              <Textarea
                id="reason"
                placeholder="Explain why you need this material..."
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Дополнительные заметки</Label>
              <Textarea
                id="notes"
                placeholder="Любая доп��лнительная информация..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full">
              Отправить запрос
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
