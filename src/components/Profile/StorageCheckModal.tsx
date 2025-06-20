import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Loader, HardDrive, Shield, Zap } from 'lucide-react';
import Portal from '../../utils/Portal';

interface StorageCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const StorageCheckModal: React.FC<StorageCheckModalProps> = ({
  isOpen,
  onClose,
  onContinue
}) => {
  const [checking, setChecking] = useState(false);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      checkStorageConnection();
    }
  }, [isOpen]);

  const checkStorageConnection = async () => {
    setChecking(true);
    setStorageStatus('checking');
    setStatusMessage('Connecting to Learnnect Storage...');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://learnnect-backend.onrender.com';
      const response = await fetch(`${API_BASE_URL}/api/storage/health`);
      const result = await response.json();

      if (result.success) {
        setStorageStatus('connected');
        setStatusMessage('Storage service is ready!');
      } else {
        setStorageStatus('error');
        setStatusMessage(result.message || 'Storage service is not available');
      }
    } catch (error) {
      setStorageStatus('error');
      setStatusMessage('Failed to connect to storage service');
    } finally {
      setChecking(false);
    }
  };

  const handleContinue = () => {
    if (storageStatus === 'connected') {
      onContinue();
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div
          className="bg-gray-900 rounded-2xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">Learnnect Storage</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
          {/* Storage Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Secure Cloud Storage</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <HardDrive className="h-5 w-5 text-neon-cyan flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium">Reliable Storage</p>
                  <p className="text-gray-400">Your files are stored securely in Google Drive</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium">Privacy Protected</p>
                  <p className="text-gray-400">Only you can access your personal files</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium">Fast Access</p>
                  <p className="text-gray-400">Quick upload and download speeds</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Check */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              {checking ? (
                <Loader className="h-5 w-5 text-blue-400 animate-spin flex-shrink-0" />
              ) : storageStatus === 'connected' ? (
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              )}
              
              <div className="text-sm">
                <p className={`font-medium ${
                  storageStatus === 'connected' ? 'text-green-400' :
                  storageStatus === 'error' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {storageStatus === 'checking' ? 'Checking Connection...' :
                   storageStatus === 'connected' ? 'Connected' : 'Connection Failed'}
                </p>
                <p className="text-gray-400">{statusMessage}</p>
              </div>
            </div>
          </div>

          {/* File Limits Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-300 mb-2">Upload Limits</h4>
            <ul className="text-xs text-blue-200 space-y-1">
              <li>• Profile Pictures: Max 5MB (JPEG, PNG, WebP)</li>
              <li>• Banner Images: Max 5MB (1584×396px recommended)</li>
              <li>• Resumes: Max 10MB (PDF, DOC, DOCX)</li>
              <li>• Auto-cleanup keeps your 3 latest files</li>
            </ul>
          </div>

            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-700 flex-shrink-0 bg-gray-900">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            
            {storageStatus === 'error' && (
              <button
                onClick={checkStorageConnection}
                disabled={checking}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {checking ? 'Checking...' : 'Retry'}
              </button>
            )}
            
            <button
              onClick={handleContinue}
              disabled={storageStatus !== 'connected'}
              className="px-6 py-2 bg-neon-cyan hover:bg-cyan-400 text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default StorageCheckModal;
