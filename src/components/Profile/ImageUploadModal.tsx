import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, Camera, RotateCcw, Crop, Info, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { learnnectStorageService } from '../../services/learnnectStorageService';
import { userDataService } from '../../services/userDataService';
import StorageCheckModal from './StorageCheckModal';
import Portal from '../../utils/Portal';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageType: 'profile' | 'banner';
  currentImageUrl?: string;
  onUpdate: () => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  imageType,
  currentImageUrl,
  onUpdate
}) => {
  const { user, updateUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showStorageCheck, setShowStorageCheck] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [currentImageError, setCurrentImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isProfile = imageType === 'profile';
  const maxSize = 5 * 1024 * 1024; // 5MB
  const recommendedDimensions = isProfile
    ? { width: 400, height: 400 }
    : { width: 1584, height: 396 }; // LinkedIn banner size

  // Convert old Google Drive URLs to new format
  const convertGoogleDriveUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;

    // Extract file ID from various Google Drive URL formats
    const fileIdMatch = url.match(/(?:\/d\/|id=|\/file\/d\/)([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Use thumbnail API for better reliability
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }

    return url; // Return original if no match
  };

  // Convert current image URL for display
  const displayCurrentImageUrl = convertGoogleDriveUrl(currentImageUrl);

  // Check if this is the first time user is uploading
  useEffect(() => {
    if (isOpen && !hasCheckedStorage && !showStorageCheck && user?.id) {
      checkIfFirstTimeUser();
    }
  }, [isOpen, hasCheckedStorage, showStorageCheck, user?.id]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setCurrentImageError(false);
    }
  }, [isOpen]);

  // Reset image error when currentImageUrl changes
  useEffect(() => {
    setCurrentImageError(false);
  }, [currentImageUrl]);

  const checkIfFirstTimeUser = async () => {
    try {
      if (!user?.id) {
        setShowStorageCheck(true);
        return;
      }

      // Check localStorage - if user has uploaded before, skip storage check
      const hasUploadedBefore = localStorage.getItem(`learnnect_has_uploaded_${user.id}`);

      if (hasUploadedBefore) {
        console.log('✅ User has uploaded before, skipping storage check');
        setHasCheckedStorage(true);
        return;
      }

      // First time user - show storage check modal
      console.log('🔍 First time user detected, showing storage check');
      setShowStorageCheck(true);

    } catch (error) {
      console.error('Error checking first-time user status:', error);
      // On error, show storage check to be safe
      setShowStorageCheck(true);
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`File too large. Maximum size is ${formatFileSize(maxSize)}.`);
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [maxSize]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.id) return;

    setUploading(true);
    try {
      const result = await learnnectStorageService.uploadProfileImage(
        user.id,
        user.email || '',
        selectedFile,
        imageType
      );

      if (result.success && result.downloadURL) {
        // Update user profile with new image URL
        const updateData = imageType === 'profile'
          ? { photoURL: result.downloadURL }
          : { bannerImage: result.downloadURL };

        await userDataService.updateUserProfile(user.id, updateData);

        // Update AuthContext user data for navbar
        if (imageType === 'profile') {
          updateUser({ avatar: result.downloadURL });
          console.log('✅ AuthContext user avatar updated:', result.downloadURL);
        }

        onUpdate();
        onClose();

        // Reset state
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        alert(`Failed to upload ${imageType} image: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error uploading ${imageType} image:`, error);
      alert(`Error uploading ${imageType} image. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    setDeleting(true);
    try {
      console.log(`🔄 Starting ${imageType} image deletion...`);

      // Always try to delete from storage first (even if image is broken)
      if (user.email) {
        const result = await learnnectStorageService.deleteProfileImage(
          user.id,
          user.email,
          imageType
        );

        if (result.success) {
          console.log(`✅ ${imageType} image deleted successfully from storage`);
        } else {
          console.warn(`⚠️ Storage deletion failed but continuing: ${result.error}`);
        }
      }

      // Always reset the profile data (this fixes broken images)
      const updateData = imageType === 'profile'
        ? { photoURL: null } // Clear custom photo to show default/gravatar
        : { bannerImage: null };

      await userDataService.updateUserProfile(user.id, updateData);
      console.log(`✅ Profile updated after ${imageType} image deletion`);

      // Update AuthContext user data for navbar
      if (imageType === 'profile') {
        updateUser({ avatar: null });
        console.log('✅ AuthContext user avatar updated to null');
      }

      // Update the parent component
      onUpdate();

      // Close the modal
      onClose();

    } catch (error) {
      console.error(`Error deleting ${imageType} image:`, error);
      alert(`Error deleting ${imageType} image. Please try again.`);
    } finally {
      setDeleting(false);
    }
  };

  const handleRevertToGravatar = async () => {
    if (!user?.id || imageType !== 'profile') return;

    setDeleting(true);
    try {
      console.log('🔄 Reverting to gravatar/auth provider photo...');

      // Delete custom images from storage
      if (user.email) {
        const result = await learnnectStorageService.deleteProfileImage(
          user.id,
          user.email,
          'profile'
        );

        if (result.success) {
          console.log('✅ Custom profile images deleted from storage');
        } else {
          console.warn(`⚠️ Storage deletion failed but continuing: ${result.error}`);
        }
      }

      // Set photoURL to null to show gravatar/auth provider photo
      await userDataService.updateUserProfile(user.id, { photoURL: null });
      console.log('✅ Profile reverted to gravatar/auth provider photo');

      // Update AuthContext user data for navbar
      updateUser({ avatar: null });
      console.log('✅ AuthContext user avatar updated to null (revert)');

      // Update the parent component
      onUpdate();

      // Close the modal
      onClose();

    } catch (error) {
      console.error('Error reverting to gravatar:', error);
      alert('Error reverting to gravatar. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleStorageCheckContinue = () => {
    // Store user-specific flag
    if (user?.id) {
      localStorage.setItem(`learnnect_has_uploaded_${user.id}`, 'true');
    }
    setHasCheckedStorage(true);
    setShowStorageCheck(false);
  };

  const handleStorageCheckClose = () => {
    setShowStorageCheck(false);
    setHasCheckedStorage(true); // Mark as checked to prevent showing again
    // Don't call onClose() here to prevent navigation issues
  };

  if (!isOpen) return null;

  // Don't show main modal if storage check is in progress
  if (showStorageCheck) {
    return (
      <StorageCheckModal
        isOpen={showStorageCheck}
        onClose={handleStorageCheckClose}
        onContinue={handleStorageCheckContinue}
      />
    );
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className="bg-gray-900 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">
              Upload {isProfile ? 'Profile Picture' : 'Banner Image'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
          {/* Guidelines */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-2">Image Guidelines:</p>
                <ul className="space-y-1 text-blue-200">
                  <li>• Maximum file size: {formatFileSize(maxSize)}</li>
                  <li>• Supported formats: JPEG, PNG, WebP</li>
                  <li>• Recommended size: {recommendedDimensions.width} × {recommendedDimensions.height} pixels</li>
                  {isProfile && <li>• Square images work best for profile pictures</li>}
                  {!isProfile && <li>• Use 4:1 aspect ratio for best results (LinkedIn standard)</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Current Image */}
          {displayCurrentImageUrl && !currentImageError && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-white">Current Image</h3>
              <div className="relative">
                <img
                  src={displayCurrentImageUrl}
                  alt={`Current ${imageType}`}
                  className={`w-full object-cover rounded-lg ${
                    isProfile ? 'h-32 w-32 rounded-full mx-auto' : 'h-32'
                  }`}
                  onLoad={() => console.log(`✅ Current ${imageType} image loaded in modal:`, displayCurrentImageUrl)}
                  onError={(e) => {
                    console.error(`❌ Current ${imageType} image failed to load in modal:`, displayCurrentImageUrl);
                    console.error('Original URL:', currentImageUrl);
                    setCurrentImageError(true);
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  {isProfile && (
                    <button
                      onClick={handleRevertToGravatar}
                      disabled={deleting}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                      title="Revert to Gravatar"
                    >
                      {deleting ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                    title="Delete Image"
                  >
                    {deleting ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {displayCurrentImageUrl && currentImageError && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-white">Current Image</h3>
              <div className="relative bg-gray-800/50 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Image failed to load</p>
                  <p className="text-sm text-gray-500">The current image URL is not accessible</p>
                </div>
                <div className="flex space-x-3">
                  {isProfile && (
                    <button
                      onClick={handleRevertToGravatar}
                      disabled={deleting}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          <span>Reverting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <RotateCcw className="h-4 w-4" />
                          <span>Revert to Gravatar</span>
                        </div>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Removing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Trash2 className="h-4 w-4" />
                        <span>Remove Broken Image</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">
              {selectedFile ? 'Preview' : 'Upload New Image'}
            </h3>
            
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className={`w-full object-cover rounded-lg ${
                    isProfile ? 'h-32 w-32 rounded-full mx-auto' : 'h-32'
                  }`}
                />
                <div className="text-sm text-gray-400 text-center">
                  {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-neon-cyan/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Max {formatFileSize(maxSize)} • JPEG, PNG, WebP
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-700 flex-shrink-0 bg-gray-900">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            
            {selectedFile && (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-6 py-2 bg-neon-cyan hover:bg-cyan-400 text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                  <span>Uploading...</span>
                </div>
              ) : (
                'Upload Image'
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ImageUploadModal;
