import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MaterialRequestCard } from "@/components/MaterialRequestCard";
import { useUserRole } from "@/hooks/useUserRole";
import { mockMaterials, mockMaterialRequests } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

const Materials = () => {
  const { isSupplier, isEmployer } = useUserRole();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState(
    isEmployer || isSupplier ? "requests" : "inventory",
  );

  const filteredMaterials = mockMaterials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const stockPercentage = material.remainingQuantity / material.totalQuantity;

    switch (selectedFilter) {
      case "low-stock":
        return stockPercentage < 0.2;
      case "medium-stock":
        return stockPercentage >= 0.2 && stockPercentage < 0.8;
      case "well-stocked":
        return stockPercentage >= 0.8;
      default:
        return true;
    }
  });

  const getStockStatus = (material: (typeof mockMaterials)[0]) => {
    const stockPercentage = material.remainingQuantity / material.totalQuantity;
    if (stockPercentage < 0.2)
      return {
        label: "Low Stock",
        color: "bg-red-500",
        variant: "destructive" as const,
      };
    if (stockPercentage < 0.8)
      return {
        label: "Medium Stock",
        color: "bg-yellow-500",
        variant: "secondary" as const,
      };
    return {
      label: "Well Stocked",
      color: "bg-green-500",
      variant: "default" as const,
    };
  };

  const materialCounts = {
    all: mockMaterials.length,
    "low-stock": mockMaterials.filter(
      (m) => m.totalQuantity > 0 && m.remainingQuantity / m.totalQuantity < 0.2,
    ).length,
    "medium-stock": mockMaterials.filter((m) => {
      if (m.totalQuantity <= 0) return false;
      const ratio = m.remainingQuantity / m.totalQuantity;
      return ratio >= 0.2 && ratio < 0.8;
    }).length,
    "well-stocked": mockMaterials.filter(
      (m) =>
        m.totalQuantity > 0 && m.remainingQuantity / m.totalQuantity >= 0.8,
    ).length,
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {(isEmployer || isSupplier) && activeTab === "requests"
                ? "Material Requests"
                : "Material Inventory"}
            </h1>
            <div className="text-lg">
              {(isEmployer || isSupplier) && activeTab === "requests"
                ? "📋"
                : "📦"}
            </div>
          </div>

          {/* Search - Only show for inventory tab */}
          {activeTab === "inventory" && (
            <Input
              placeholder="Search materials or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {(isEmployer || isSupplier) && (
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <span>📋</span>
                Requests
              </TabsTrigger>
            )}
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <span>📦</span>
              Inventory
            </TabsTrigger>
          </TabsList>

          {/* Material Requests Tab */}
          {(isEmployer || isSupplier) && (
            <TabsContent value="requests" className="mt-6">
              <MaterialRequestsSection />
            </TabsContent>
          )}

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="mt-6">
            <InventorySection
              searchTerm={searchTerm}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              filteredMaterials={filteredMaterials}
              getStockStatus={getStockStatus}
              materialCounts={materialCounts}
            />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

const MaterialRequestsSection = () => {
  const { isEmployer, isSupplier } = useUserRole();
  const [requestFilter, setRequestFilter] = useState<string>("pending");

  const filteredRequests = mockMaterialRequests.filter((request) => {
    if (requestFilter === "all") return true;
    return request.status === requestFilter;
  });

  const handleStatusChange = (
    requestId: string,
    status: string,
    reason?: string,
  ) => {
    // Here you would normally update the request in your backend
    console.log("Status change:", { requestId, status, reason });
  };

  const requestCounts = {
    all: mockMaterialRequests.length,
    pending: mockMaterialRequests.filter((r) => r.status === "pending").length,
    approved: mockMaterialRequests.filter((r) => r.status === "approved")
      .length,
    rejected: mockMaterialRequests.filter((r) => r.status === "rejected")
      .length,
    fulfilled: mockMaterialRequests.filter((r) => r.status === "fulfilled")
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Request Filters */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "pending", label: "Pending", emoji: "⏳" },
          { key: "approved", label: "Approved", emoji: "✅" },
          { key: "rejected", label: "Rejected", emoji: "❌" },
          { key: "fulfilled", label: "Fulfilled", emoji: "📦" },
        ].map((filter) => (
          <Button
            key={filter.key}
            variant={requestFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => setRequestFilter(filter.key)}
            className="text-xs h-8"
          >
            {filter.emoji} {filter.label} (
            {requestCounts[filter.key as keyof typeof requestCounts]})
          </Button>
        ))}
      </div>

      {/* Request Cards */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {requestFilter === "all" ? "" : requestFilter} requests found
            </h3>
            <p className="text-gray-600">
              {requestFilter === "pending"
                ? "All caught up! No pending material requests at the moment."
                : `No ${requestFilter} material requests to display.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <MaterialRequestCard
              key={request.id}
              request={request}
              showActions={isEmployer || isSupplier}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const InventorySection = ({
  searchTerm,
  selectedFilter,
  setSelectedFilter,
  filteredMaterials,
  getStockStatus,
  materialCounts,
}: {
  searchTerm: string;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filteredMaterials: typeof mockMaterials;
  getStockStatus: (material: (typeof mockMaterials)[0]) => {
    label: string;
    color: string;
    variant: "destructive" | "secondary" | "default";
  };
  materialCounts: {
    all: number;
    "low-stock": number;
    "medium-stock": number;
    "well-stocked": number;
  };
}) => {
  return (
    <div className="space-y-6">
      {/* Material Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inventory Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {materialCounts.all}
              </div>
              <div className="text-sm text-gray-600">Total Materials</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {materialCounts["low-stock"]}
              </div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {materialCounts["medium-stock"]}
              </div>
              <div className="text-sm text-gray-600">Medium Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {materialCounts["well-stocked"]}
              </div>
              <div className="text-sm text-gray-600">Well Stocked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Material Filters */}
      <Tabs
        value={selectedFilter}
        onValueChange={setSelectedFilter}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full h-auto p-1">
          <TabsTrigger value="all" className="text-xs px-2 py-2">
            All
            {materialCounts.all > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1">
                {materialCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="text-xs px-2 py-2">
            Low
            {materialCounts["low-stock"] > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs h-5 px-1">
                {materialCounts["low-stock"]}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="medium-stock" className="text-xs px-2 py-2">
            Medium
            {materialCounts["medium-stock"] > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1">
                {materialCounts["medium-stock"]}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="well-stocked" className="text-xs px-2 py-2">
            High
            {materialCounts["well-stocked"] > 0 && (
              <Badge variant="default" className="ml-1 text-xs h-5 px-1">
                {materialCounts["well-stocked"]}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value={selectedFilter} className="mt-0">
            <div className="space-y-4">
              {filteredMaterials.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="text-4xl mb-2">📦</div>
                    <div className="text-gray-600">No materials found</div>
                    {searchTerm && (
                      <div className="text-sm text-gray-500 mt-1">
                        Try adjusting your search terms
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredMaterials.map((material) => {
                  const stockPercentage =
                    material.totalQuantity > 0
                      ? (material.remainingQuantity / material.totalQuantity) *
                        100
                      : 0;
                  const usagePercentage =
                    material.totalQuantity > 0
                      ? (material.usedQuantity / material.totalQuantity) * 100
                      : 0;
                  const stockStatus = getStockStatus(material);

                  return (
                    <Card key={material.id} className="w-full">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {material.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Supplier: {material.supplier}
                            </p>
                          </div>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.label}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Stock Level</span>
                              <span>
                                {material.remainingQuantity} /{" "}
                                {material.totalQuantity} {material.unit}
                              </span>
                            </div>
                            <Progress value={stockPercentage} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Usage</span>
                              <span>
                                {material.usedQuantity} {material.unit} used
                              </span>
                            </div>
                            <Progress value={usagePercentage} className="h-2" />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Price/Unit:</span>
                              <div className="font-medium">
                                ${material.pricePerUnit}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Last Delivery:
                              </span>
                              <div className="font-medium">
                                {new Date(
                                  material.deliveryDate,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Materials;
