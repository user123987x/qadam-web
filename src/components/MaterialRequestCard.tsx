import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MaterialRequest } from "@/lib/types";
import { urgencyLevels, requestStatuses } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import {
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  PackageIcon,
  ClockIcon,
  CheckIcon,
  XIcon,
} from "@/components/ui/icons";

interface MaterialRequestCardProps {
  request: MaterialRequest;
  showActions?: boolean;
  onStatusChange?: (requestId: string, status: string, reason?: string) => void;
}

export const MaterialRequestCard = ({
  request,
  showActions = false,
  onStatusChange,
}: MaterialRequestCardProps) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const urgencyConfig = urgencyLevels.find(
    (level) => level.value === request.urgency,
  );
  const statusConfig = requestStatuses.find(
    (status) => status.value === request.status,
  );

  const handleApprove = () => {
    onStatusChange?.(request.id, "approved");
    toast({
      title: "Запрос одобрен",
      description: `Материальный запрос для ${request.materialName} был одобрен.`,
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Требуется причина отклонения",
        description: "Пожалуйста, укажите причину отклонения этого запроса.",
        variant: "destructive",
      });
      return;
    }

    onStatusChange?.(request.id, "rejected", rejectReason);
    toast({
      title: "Запрос отклонен",
      description: `Материальный запрос для ${request.materialName} был отклонен.`,
      variant: "destructive",
    });
    setShowRejectReason(false);
    setRejectReason("");
  };

  const handleFulfill = () => {
    onStatusChange?.(request.id, "fulfilled");
    toast({
      title: "Запрос выполнен",
      description: `Материальный запрос для ${request.materialName} отмечено как выполненное.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <PackageIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {request.materialName}
              </h3>
              <p className="text-sm text-gray-600">
                {request.requestedQuantity} {request.unit} запрошено
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge
              variant="outline"
              className={`${statusConfig?.color} text-white border-0`}
            >
              {statusConfig?.label}
            </Badge>
            <Badge
              variant="outline"
              className={`${urgencyConfig?.color} text-white border-0`}
            >
              {urgencyConfig?.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Request Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Работник:</span>
            <span className="font-medium">{request.workerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Запрошено:</span>
            <span className="font-medium">
              {formatDate(request.requestDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPinIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Проект:</span>
            <span className="font-medium">{request.projectName}</span>
          </div>
        </div>

        {/* Reason */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Причина</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {request.reason}
          </p>
        </div>

        {/* Notes */}
        {request.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Дополнительные заметки
            </h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {request.notes}
            </p>
          </div>
        )}

        {/* Approval/Rejection Info */}
        {(request.status === "approved" ||
          request.status === "rejected" ||
          request.status === "fulfilled") && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {request.status === "approved" &&
                  `Одобрено ${request.approvedBy} в ${request.approvedDate ? formatDate(request.approvedDate) : "N/A"}`}
                {request.status === "rejected" &&
                  `Отклонено ${request.approvedBy} в ${request.approvedDate ? formatDate(request.approvedDate) : "N/A"}`}
                {request.status === "fulfilled" &&
                  `Выполнено ${request.approvedDate ? formatDate(request.approvedDate) : "N/A"}`}
              </span>
            </div>
            {request.rejectionReason && (
              <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                <strong>Причина отклонения:</strong> {request.rejectionReason}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {showActions && request.status === "pending" && (
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Одобрить
              </Button>
              <Button
                onClick={() => setShowRejectReason(!showRejectReason)}
                variant="destructive"
                className="flex-1"
                size="sm"
              >
                <XIcon className="h-4 w-4 mr-2" />
                Отклонять
              </Button>
            </div>

            {showRejectReason && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Пожалуйста, укажите причину отклонения..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleReject}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    Confirm Rejection
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRejectReason(false);
                      setRejectReason("");
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fulfill Button for Approved Requests */}
        {showActions && request.status === "approved" && (
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleFulfill}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Отметить как выполненное
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
