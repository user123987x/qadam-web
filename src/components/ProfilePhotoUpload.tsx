import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";
import {
  UserIcon,
  EmployerIcon,
  WorkerIcon,
  SupplierIcon,
} from "@/components/ui/icons";

interface ProfilePhotoUploadProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const ProfilePhotoUpload = ({
  size = "lg",
  className = "",
}: ProfilePhotoUploadProps) => {
  const { currentUser, userRole } = useUserRole();
  const { profilePhoto, isUploading, uploadPhoto, removePhoto, validateFile } =
    useProfilePhoto(currentUser?.id || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8";
      case "md":
        return "w-12 h-12";
      case "lg":
        return "w-20 h-20";
      case "xl":
        return "w-32 h-32";
      default:
        return "w-20 h-20";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "md":
        return 24;
      case "lg":
        return 32;
      case "xl":
        return 48;
      default:
        return 32;
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "employer":
        return EmployerIcon;
      case "worker":
        return WorkerIcon;
      case "supplier":
        return SupplierIcon;
      default:
        return UserIcon;
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadPhoto(file);
      toast({
        title: "Profile Photo Updated",
        description: "Your profile photo has been successfully updated!",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить фото. Попробуйте еще раз.",
        variant: "destructive",
      });
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    removePhoto();
    toast({
      title: "Photo Removed",
      description: "Your profile photo has been removed.",
    });
    setIsDialogOpen(false);
  };

  const RoleIcon = getRoleIcon();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className={`${getSizeClasses()} rounded-full overflow-hidden relative group cursor-pointer ${className}`}
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-soft-green to-deep-blue rounded-full flex items-center justify-center">
              <RoleIcon size={getIconSize()} className="text-white" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
            <div className="text-white text-xs font-medium text-center">
              {size === "sm" ? "📷" : "Edit"}
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Photo Preview */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Current profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-soft-green to-deep-blue rounded-full flex items-center justify-center">
                  <RoleIcon size={48} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-primary w-full"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Загрузка...
                </div>
              ) : profilePhoto ? (
Изменить фото
                "Change Photo"
              ) : (
                "Загрузить фото"
              )}
            </Button>

            {profilePhoto && (
              <Button
                onClick={handleRemovePhoto}
                variant="outline"
                className="w-full"
              >
                Remove Photo
              </Button>
            )}
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Info Text */}
          <div className="text-xs text-neutral-500 text-center">
            <p>Supports JPG, PNG, GIF up to 5MB</p>
            <p>Recommended: Square image, 400x400px or larger</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};