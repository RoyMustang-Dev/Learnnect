import React from 'react';
import { X, AlertTriangle, Upload, FileCheck } from 'lucide-react';
import Portal from '../../utils/Portal';

interface DuplicateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadNew: () => void;
  onUseExisting: () => void;
  fileName: string;
  fileType: 'image' | 'resume';
  existingFileInfo?: {
    name: string;
    uploadedAt?: string;
    size?: string;
  };
}

const DuplicateFileModal: React.FC<DuplicateFileModalProps> = ({
  isOpen,
  onClose,
  onUploadNew,
  onUseExisting,
  fileName,
  fileType,
  existingFileInfo
}) => {
  if (!isOpen) return null;

  const isImage = fileType === 'image';

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="bg-gradient-to-br from-gray-900/95 to-neon-black/95 rounded-2xl border border-yellow-500/50 backdrop-blur-sm w-full max-w-md overflow-hidden"
          style={{
            boxShadow: '0 0 50px rgba(234,179,8,0.3), inset 0 0 30px rgba(234,179,8,0.1)'
          }}
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-45deg from-yellow-500/10 to-orange-500/10 opacity-50" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-yellow-400 transition-colors rounded-full hover:bg-yellow-500/10 bg-gray-800/50"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="relative z-10 p-6 border-b border-yellow-500/20">
            <div className="flex items-center space-x-3 pr-12">
              <div className="p-2 bg-yellow-500/20 rounded-full border border-yellow-500/40">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Duplicate File Detected
                </h3>
                <p className="text-sm text-yellow-200/80">
                  {isImage ? 'Similar image found' : 'File with same name exists'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 space-y-4">
            <div className="text-center">
              <p className="text-gray-300 mb-3">
                {isImage 
                  ? 'You already have an image uploaded. What would you like to do?'
                  : `A file named "${fileName}" already exists in your account.`
                }
              </p>
              
              {existingFileInfo && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                  <p className="text-yellow-300 font-medium text-sm">
                    Existing: {existingFileInfo.name}
                  </p>
                  {existingFileInfo.uploadedAt && (
                    <p className="text-yellow-200/80 text-xs mt-1">
                      Uploaded: {existingFileInfo.uploadedAt}
                    </p>
                  )}
                  {existingFileInfo.size && (
                    <p className="text-yellow-200/80 text-xs">
                      Size: {existingFileInfo.size}
                    </p>
                  )}
                </div>
              )}

              <p className="text-sm text-gray-400 mb-4">
                {isImage 
                  ? 'Uploading a new image will replace the existing one.'
                  : 'Choose whether to upload as a new version or use the existing file.'
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onUploadNew}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-yellow-500/25"
              >
                <Upload className="h-4 w-4" />
                <span>
                  {isImage ? 'Replace with New Image' : 'Upload as New Version'}
                </span>
              </button>
              
              <button
                onClick={onUseExisting}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors font-medium"
              >
                <FileCheck className="h-4 w-4" />
                <span>
                  {isImage ? 'Keep Current Image' : 'Use Existing File'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default DuplicateFileModal;
