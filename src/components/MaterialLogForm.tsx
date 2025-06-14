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
import { mockProjects, mockMaterials } from "@/lib/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";

export const MaterialLogForm = () => {
  const { currentUser, isWorker, isSupplier } = useUserRole();
  const [formData, setFormData] = useState({
    projectId: "",
    materialId: "",
    quantity: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const availableProjects = isWorker
    ? mockProjects.filter((p) =>
        p.assignedWorkers.includes(currentUser?.id || ""),
      )
    : mockProjects.filter((p) => p.status === "active");

  const selectedMaterial = mockMaterials.find(
    (m) => m.id === formData.materialId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.projectId || !formData.materialId || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Пожалуйста, заполните все обязательные поля.",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseFloat(formData.quantity);
    if (selectedMaterial && quantity > selectedMaterial.remainingQuantity) {
      toast({
        title: "Insufficient Material",
        description: `Only ${selectedMaterial.remainingQuantity} ${selectedMaterial.unit} available.`,
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would submit to an API
    const action = isSupplier ? "delivered" : "used";
    toast({
      title: `Material ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      description: `Successfully logged ${quantity} ${selectedMaterial?.unit} of ${selectedMaterial?.name}`,
    });

    // Reset form
    setFormData({
      projectId: "",
      materialId: "",
      quantity: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{isSupplier ? "🚚" : "📦"}</span>
          {isSupplier ? "Log Material Delivery" : "Log Material Usage"}
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
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Material Selection */}
          <div className="space-y-2">
            <Label htmlFor="material">Material *</Label>
            <Select
              value={formData.materialId}
              onValueChange={(value) =>
                setFormData({ ...formData, materialId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите материал" />
              </SelectTrigger>
              <SelectContent>
                {mockMaterials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} - {material.remainingQuantity}{" "}
                    {material.unit} available
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Material Info */}
          {selectedMaterial && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-700">
                <div className="font-medium">{selectedMaterial.name}</div>
                <div>
                  Available: {selectedMaterial.remainingQuantity}{" "}
                  {selectedMaterial.unit}
                </div>
                <div>
                  Price: ${selectedMaterial.pricePerUnit} per{" "}
                  {selectedMaterial.unit}
                </div>
                <div>Supplier: {selectedMaterial.supplier}</div>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              Quantity ({selectedMaterial?.unit || "units"}) *
            </Label>
            <Input
              id="quantity"
              type="number"
              step="0.1"
              min="0"
              max={selectedMaterial?.remainingQuantity || undefined}
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder={`Enter quantity in ${selectedMaterial?.unit || "units"}`}
              required
            />
          </div>

          {/* Cost Calculation */}
          {selectedMaterial && formData.quantity && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm text-green-700">
                <div className="font-medium">Cost Calculation:</div>
                <div>
                  {formData.quantity} {selectedMaterial.unit} × $
                  {selectedMaterial.pricePerUnit} = $
                  {(
                    parseFloat(formData.quantity) *
                    selectedMaterial.pricePerUnit
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder={`Дополнительные заметки об этой ${isSupplier ? "поставке" : "использовании"}...`}
              rows={2}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isSupplier ? "Записать поставку" : "Записать использование"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
