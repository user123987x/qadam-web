import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkLogForm } from "@/components/WorkLogForm";
import { MaterialLogForm } from "@/components/MaterialLogForm";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useUserRole } from "@/hooks/useUserRole";

const AddEntry = () => {
  const { isWorker, isSupplier, isEmployer } = useUserRole();
  const [activeTab, setActiveTab] = useState(
    isWorker ? "work" : isSupplier ? "materials" : "work",
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="text-lg">➕</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add Entry</h1>
              <p className="text-sm text-gray-600">
                Log work progress or material usage
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`grid w-full ${isEmployer ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {(isWorker || isEmployer) && (
              <TabsTrigger value="work" className="flex items-center gap-2">
                <span>📝</span>
                Work Log
              </TabsTrigger>
            )}
            {(isSupplier || isEmployer || isWorker) && (
              <TabsTrigger
                value="materials"
                className="flex items-center gap-2"
              >
                <span>{isSupplier ? "🚚" : "📦"}</span>
                {isSupplier ? "Deliveries" : "Materials"}
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
          </div>
        </Tabs>

        {/* Instructions based on user role */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700">
            <div className="font-medium mb-2">💡 Tips:</div>
            {isWorker && (
              <ul className="space-y-1">
                <li>• Log your daily work to track earnings automatically</li>
                <li>• Be specific about the work completed</li>
                <li>• Record material usage to help with inventory</li>
              </ul>
            )}
            {isEmployer && (
              <ul className="space-y-1">
                <li>• Log work on behalf of workers or track material usage</li>
                <li>
                  • Review entries regularly for accurate project tracking
                </li>
                <li>• Monitor material consumption to prevent shortages</li>
              </ul>
            )}
            {isSupplier && (
              <ul className="space-y-1">
                <li>• Record all material deliveries promptly</li>
                <li>• Check inventory levels regularly</li>
                <li>• Note any quality issues or delivery concerns</li>
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
