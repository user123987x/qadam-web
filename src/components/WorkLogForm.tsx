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
import { mockProjects, mockWorkers } from "@/lib/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";

export const WorkLogForm = () => {
  const { currentUser, isWorker } = useUserRole();
  const [formData, setFormData] = useState({
    projectId: "",
    workerId: isWorker ? currentUser?.id || "" : "",
    areaCompleted: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const availableProjects = isWorker
    ? mockProjects.filter((p) =>
        p.assignedWorkers.includes(currentUser?.id || ""),
      )
    : mockProjects.filter((p) => p.status === "active");

  const availableWorkers = isWorker
    ? mockWorkers.filter((w) => w.id === currentUser?.id)
    : mockWorkers;

  const selectedWorker = mockWorkers.find((w) => w.id === formData.workerId);
  const calculatedEarnings =
    selectedWorker && formData.areaCompleted
      ? selectedWorker.ratePerSquareMeter * parseFloat(formData.areaCompleted)
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.projectId || !formData.workerId || !formData.areaCompleted) {
      toast({
        title: "Missing Information",
        description: "Пожалуйста, заполните все обязательные поля.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would submit to an API
    toast({
      title: "Добавлен журнал работ",
      description: `Успешно зарегистрирован ${formData.areaCompleted} м² работы. Доход: $${calculatedEarnings.toFixed(2)}`,
    });

    // Reset form
    setFormData({
      projectId: "",
      workerId: isWorker ? currentUser?.id || "" : "",
      areaCompleted: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📝</span>
          Журнал ежедневной работы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Проект *</Label>
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

          {/* Worker Selection (only for employers) */}
          {!isWorker && (
            <div className="space-y-2">
              <Label htmlFor="worker">Работник *</Label>
              <Select
                value={formData.workerId}
                onValueChange={(value) =>
                  setFormData({ ...formData, workerId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите рабочего" />
                </SelectTrigger>
                <SelectContent>
                  {availableWorkers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name} - {worker.specialization} ($
                      {worker.ratePerSquareMeter}/м²)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Дата *</Label>
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

          {/* Area Completed */}
          <div className="space-y-2">
            <Label htmlFor="area">Площадь завершена (м²) *</Label>
            <Input
              id="area"
              type="number"
              step="0.1"
              min="0"
              value={formData.areaCompleted}
              onChange={(e) =>
                setFormData({ ...formData, areaCompleted: e.target.value })
              }
              placeholder="Введите площадь в квадратных метрах"
              required
            />
          </div>

          {/* Earnings Calculation */}
          {selectedWorker && formData.areaCompleted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="text-sm text-emerald-700">
                <div className="font-medium">Расчет прибыли:</div>
                <div>
                  {formData.areaCompleted} м² × $
                  {selectedWorker.ratePerSquareMeter}/м² = 
                  {calculatedEarnings.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание работы</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Опишите работу, выполненную сегодня..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Записать работу
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
