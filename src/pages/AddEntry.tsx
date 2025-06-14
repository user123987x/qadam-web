import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkLogForm } from "@/components/WorkLogForm";
import { MaterialLogForm } from "@/components/MaterialLogForm";
import { MaterialRequestForm } from "@/components/MaterialRequestForm";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useUserRole } from "@/hooks/useUserRole";

const AddEntry = () => {
  const { isWorker, isSupplier, isEmployer } = useUserRole();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    isWorker ? "work" : isSupplier ? "materials" : "work",
  );

  // Handle URL parameters to open specific tabs
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      if (tabParam === "request" && isWorker) {
        setActiveTab("request");
      } else if (tabParam === "work" && (isWorker || isEmployer)) {
        setActiveTab("work");
      } else if (tabParam === "materials") {
        setActiveTab("materials");
      }
    }
  }, [searchParams, isWorker, isEmployer]);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="text-lg">➕</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Добавить запись
              </h1>
              <p className="text-sm text-gray-600">
                Записать прогресс работы или использование материалов
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`grid w-full ${
              isEmployer
                ? "grid-cols-2"
                : isWorker
                  ? "grid-cols-3"
                  : "grid-cols-1"
            }`}
          >
            {(isWorker || isEmployer) && (
              <TabsTrigger value="work" className="flex items-center gap-2">
                <span>📝</span>
                Журнал работ
              </TabsTrigger>
            )}
            {(isSupplier || isEmployer || isWorker) && (
              <TabsTrigger
                value="materials"
                className="flex items-center gap-2"
              >
                <span>{isSupplier ? "🚚" : "📦"}</span>
                {isSupplier ? "Поставки" : "Материалы"}
              </TabsTrigger>
            )}
            {isWorker && (
              <TabsTrigger value="request" className="flex items-center gap-2">
                <span>📋</span>
                Заявка
              </TabsTrigger>
            )}
          </TabsList>

          <div className="mt-6">
            {(isWorker || isEmployer) && (
              <TabsContent value="work" className="mt-0">
                <WorkLogForm />
              </TabsContent>
            )}

            <TabsContent value="materials" className="mt-0">
              <MaterialLogForm />
            </TabsContent>

            {isWorker && (
              <TabsContent value="request" className="mt-0">
                <MaterialRequestForm />
              </TabsContent>
            )}
          </div>
        </Tabs>

        {/* Instructions based on user role */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700">
            <div className="font-medium mb-2">💡 Советы:</div>
            {isWorker && (
              <ul className="space-y-1">
                <li>
                  • Записывайте ежедневную работу для автоматического
                  отслеживания заработка
                </li>
                <li>• Будьте конкретны в описании выполненной работы</li>
                <li>
                  • Записывайте использование материалов для помощи в
                  инвентаризации
                </li>
                <li>• Запрашивайте дополнительные материалы при их нехватке</li>
              </ul>
            )}
            {isEmployer && (
              <ul className="space-y-1">
                <li>
                  • Записывайте работы от имени рабочих или отслеживайте
                  использование материалов
                </li>
                <li>
                  • Регулярно просматривайте записи для точного отслеживания
                  проектов
                </li>
                <li>
                  • Мониторьте потребление материалов для предотвращения
                  нехватки
                </li>
              </ul>
            )}
            {isSupplier && (
              <ul className="space-y-1">
                <li>• Записывайте все поставки материалов оперативно</li>
                <li>• Регулярно проверяйте уровни запасов</li>
                <li>• Отмечайте любые проблемы с качеством или доставкой</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AddEntry;
