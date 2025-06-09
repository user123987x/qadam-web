import { useState, useEffect } from "react";

export const useProfilePhoto = (userId: string) => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Load saved profile photo from localStorage
    const savedPhoto = localStorage.getItem(`profilePhoto_${userId}`);
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, [userId]);

  const uploadPhoto = async (file: File): Promise<void> => {
    setIsUploading(true);

    try {
      // Create a FileReader to convert the file to base64
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = (e) => {
          const result = e.target?.result as string;

          // Save to localStorage (in a real app, this would upload to a server)
          localStorage.setItem(`profilePhoto_${userId}`, result);
          setProfilePhoto(result);
          setIsUploading(false);
          resolve();
        };

        reader.onerror = () => {
          setIsUploading(false);
          reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
      });
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  };

  const removePhoto = () => {
    localStorage.removeItem(`profilePhoto_${userId}`);
    setProfilePhoto(null);
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return { isValid: false, error: "Please select an image file" };
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { isValid: false, error: "Image must be smaller than 5MB" };
    }

    return { isValid: true };
  };

  return {
    profilePhoto,
    isUploading,
    uploadPhoto,
    removePhoto,
    validateFile,
  };
};
