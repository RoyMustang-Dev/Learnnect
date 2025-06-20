import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { resumeService, Resume } from '../../services/resumeService';

import { learnnectStorageService } from '../../services/learnnectStorageService';
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Calendar,
  FileCheck,
  AlertCircle,
  Loader2,
  CheckCircle,
  X
} from 'lucide-react';

import Portal from '../../utils/Portal';
import StorageCheckModal from './StorageCheckModal';
import DuplicateFileModal from './DuplicateFileModal';

interface ResumeSectionProps {
  onUpdate?: () => void;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ onUpdate }) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null); // Track which resume is being deleted
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateFileInfo, setDuplicateFileInfo] = useState<{
    newFile: File;
    existingResume: Resume;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [showStorageConnectionModal, setShowStorageConnectionModal] = useState(false);


  useEffect(() => {
    if (user?.id) {
      loadResumes();
    }
  }, [user?.id]);

  // Auto-hide success messages after 12 seconds
  useEffect(() => {
    if (message && message.type === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 12000); // 12 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadResumes = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const userResumes = await resumeService.getUserResumes(user.id);
      setResumes(userResumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
      setMessage({ type: 'error', text: 'Failed to load resumes' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user?.id) return;

    // Check if this is the first time user is uploading
    const hasUploadedBefore = localStorage.getItem('learnnect_has_uploaded');
    if (!hasUploadedBefore) {
      setShowStorageConnectionModal(true);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setMessage(null);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      // Use user's email for consistent folder identification
      const userEmail = user.email || 'unknown@example.com';
      const result = await resumeService.uploadResume(user.id, file, userEmail);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Handle duplicate file
      if (!result.success && result.error === 'DUPLICATE_FILE' && result.resume) {
        setUploading(false);
        setUploadProgress(0);
        setDuplicateFileInfo({ newFile: file, existingResume: result.resume });
        setShowDuplicateModal(true);
        return;
      }

      if (result.success && result.resume) {
        // Small delay to show 100% progress
        setTimeout(() => {
          setResumes(prev => [result.resume!, ...prev.slice(0, 2)]); // Keep latest 3
          setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
          onUpdate?.();
          setUploadProgress(0);
        }, 500);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload resume' });
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setMessage({ type: 'error', text: 'Failed to upload resume' });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };





  const handleDuplicateUploadNew = async () => {
    if (!duplicateFileInfo || !user?.id) return;

    setShowDuplicateModal(false);
    const file = duplicateFileInfo.newFile;
    setDuplicateFileInfo(null);

    try {
      setUploading(true);
      setMessage(null);

      // Force upload by temporarily renaming the file
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const newFileName = `${file.name.replace(/\.[^/.]+$/, '')}_v${timestamp}.${fileExtension}`;

      const renamedFile = new File([file], newFileName, { type: file.type });

      const userEmail = user.email || 'unknown@example.com';
      const result = await resumeService.uploadResume(user.id, renamedFile, userEmail);

      if (result.success && result.resume) {
        setResumes(prev => [result.resume!, ...prev.slice(0, 2)]);
        setMessage({ type: 'success', text: 'Resume uploaded as new version successfully!' });
        onUpdate?.();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload resume' });
      }
    } catch (error) {
      console.error('Error uploading new version:', error);
      setMessage({ type: 'error', text: 'Failed to upload resume' });
    } finally {
      setUploading(false);
    }
  };

  const handleDuplicateImportExisting = async () => {
    setShowDuplicateModal(false);
    setDuplicateFileInfo(null);
    setMessage({ type: 'success', text: 'Using existing resume file.' });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDeleteClick = (resume: Resume) => {
    setResumeToDelete(resume);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user?.id || !resumeToDelete) return;

    setDeleting(resumeToDelete.id);
    setDeleteProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setDeleteProgress(prev => {
          if (prev >= 80) return prev;
          return prev + Math.random() * 10;
        });
      }, 150);

      const success = await resumeService.deleteResume(resumeToDelete.id, user.id);

      clearInterval(progressInterval);
      setDeleteProgress(100);

      if (success) {
        // Small delay to show 100% progress
        setTimeout(() => {
          setResumes(prev => prev.filter(r => r.id !== resumeToDelete.id));
          setMessage({ type: 'success', text: 'Resume deleted successfully' });
          onUpdate?.();
          setDeleteProgress(0);
        }, 300);
      } else {
        setMessage({ type: 'error', text: 'Failed to delete resume' });
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      setMessage({ type: 'error', text: 'Failed to delete resume' });
    } finally {
      setTimeout(() => {
        setShowDeleteModal(false);
        setResumeToDelete(null);
        setDeleting(null);
        setDeleteProgress(0);
      }, 300);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setResumeToDelete(null);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-neon-cyan" />
          <span className="ml-2 text-gray-300">Loading resumes...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-neon-cyan" />
            </div>
            <h3 className="text-lg font-bold text-white">Resume Management</h3>
          </div>
          <div className="text-sm text-gray-400">
            {resumes.length}/3 resumes
          </div>
        </div>

        {/* Enhanced Message with Auto-dismiss */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg border relative overflow-hidden ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}>
            <div className="flex items-center space-x-3">
              {message.type === 'success' ? (
                <div className="flex-shrink-0 p-1 bg-green-500/20 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex-shrink-0 p-1 bg-red-500/20 rounded-full">
                  <AlertCircle className="h-4 w-4" />
                </div>
              )}
              <p className="text-sm font-medium flex-1">{message.text}</p>
              <button
                onClick={() => setMessage(null)}
                className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Auto-dismiss progress bar for success messages */}
            {message.type === 'success' && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/20">
                <div
                  className="h-full bg-green-500 transition-all duration-[12000ms] ease-linear"
                  style={{ width: '0%', animation: 'progress-shrink 12s linear forwards' }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* Add CSS animation for progress bar */}
        <style jsx>{`
          @keyframes progress-shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
            dragActive 
              ? 'border-neon-cyan bg-neon-cyan/5' 
              : 'border-gray-600 hover:border-gray-500'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="text-center">
            {uploading ? (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mb-2" />
                <div className="space-y-2">
                  <p className="text-gray-300">Uploading resume... {Math.round(uploadProgress)}%</p>
                  {/* Upload Progress Bar */}
                  <div className="w-48 bg-gray-700 rounded-full h-2 mx-auto">
                    <div
                      className="bg-gradient-to-r from-neon-cyan to-cyan-400 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-300 mb-1">
                  Drop your resume here or <span className="text-neon-cyan">click to browse</span>
                </p>
                <p className="text-sm text-gray-500">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resume List */}
        {resumes.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Your Resumes</h4>
            {resumes.map((resume, index) => (
              <div
                key={resume.id}
                className="bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors p-4"
              >
                {/* Top Section: Icon + Name + Tags (2 lines only) */}
                <div className="flex items-start space-x-3 mb-3">
                  {/* File Icon */}
                  <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-neon-cyan" />
                  </div>

                  {/* File Details - Only 2 Lines */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Line 1: Document Name */}
                    <div>
                      <h5 className="text-white font-semibold text-sm truncate">{resume.originalName}</h5>
                    </div>

                    {/* Line 2: Tags (Latest, Parsed) */}
                    <div className="flex items-center space-x-2">
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs bg-neon-cyan/20 text-neon-cyan rounded-full font-medium">
                          Latest
                        </span>
                      )}

                    </div>
                  </div>
                </div>

                {/* Bottom Section: Separate 2-Line Grid for Metadata & Buttons */}
                <div className="space-y-3">
                  {/* Line 1: Date, Size, Version - Full Width Equal Distribution */}
                  <div className="grid grid-cols-3 w-full text-xs text-gray-400" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(resume.uploadedAt)}</span>
                    </div>
                    <div className="text-center">
                      <span>{resumeService.formatFileSize(resume.fileSize)}</span>
                    </div>
                    <div className="text-right">
                      <span>Version {resume.version}</span>
                    </div>
                  </div>

                  {/* Line 2: Action Buttons - Full Width Equal Distribution */}
                  <div className="grid grid-cols-2 gap-3 w-full" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <button
                      onClick={() => window.open(resume.downloadURL, '_blank')}
                      className="flex items-center justify-center space-x-1 px-3 py-2 text-xs text-gray-400 hover:text-neon-cyan transition-colors rounded-lg hover:bg-neon-cyan/10 border border-gray-600 hover:border-neon-cyan/30"
                      title="Download"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => handleDeleteClick(resume)}
                        disabled={deleting === resume.id}
                        className="flex items-center justify-center space-x-1 px-3 py-2 text-xs text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 border border-gray-600 hover:border-red-500/30 disabled:opacity-50 w-full"
                        title="Delete"
                      >
                        {deleting === resume.id ? (
                          <>
                            <div className="animate-spin h-3 w-3 border border-red-400 border-t-transparent rounded-full" />
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </>
                        )}
                      </button>

                      {/* Progress Ring for Delete */}
                      {deleting === resume.id && deleteProgress > 0 && (
                        <div className="absolute inset-0 rounded-lg">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <rect
                              className="text-red-200"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              x="1" y="1" width="98" height="98"
                              rx="8"
                            />
                            <rect
                              className="text-red-400"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray={`${deleteProgress * 3.92}, 392`}
                              strokeLinecap="round"
                              fill="none"
                              x="1" y="1" width="98" height="98"
                              rx="8"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-4 p-3 bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg">
          <p className="text-sm text-neon-cyan">
            💡 We keep your latest 3 resume versions securely on Learnnect servers. Upload a new one to replace the oldest.
          </p>
        </div>
      </div>



      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && resumeToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-gradient-to-br from-gray-900/95 to-neon-black/95 rounded-2xl border border-red-500/50 backdrop-blur-sm w-full max-w-md overflow-hidden"
            style={{
              boxShadow: '0 0 50px rgba(239,68,68,0.3), inset 0 0 30px rgba(239,68,68,0.1)'
            }}
          >
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-gradient-to-45deg from-red-500/10 to-red-600/10 opacity-50" />

            {/* Close Button */}
            <button
              onClick={handleDeleteCancel}
              className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10 bg-gray-800/50"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="relative z-10 p-6 border-b border-red-500/20">
              <div className="flex items-center space-x-3 pr-12">
                <div className="p-2 bg-red-500/20 rounded-full border border-red-500/40">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500">
                    Delete Resume
                  </h3>
                  <p className="text-sm text-red-200/80">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 space-y-4">
              <div className="text-center">
                <p className="text-gray-300 mb-2">
                  Are you sure you want to delete this resume?
                </p>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                  <p className="text-red-300 font-medium text-sm">
                    {resumeToDelete.originalName}
                  </p>
                  <p className="text-red-200/80 text-xs mt-1">
                    Uploaded on {formatDate(resumeToDelete.uploadedAt)}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  This will permanently remove the resume from your account.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 text-sm text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting !== null}
                  className="flex-1 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting !== null ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Deleting... {Math.round(deleteProgress)}%</span>
                    </div>
                  ) : (
                    'Delete Resume'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Storage Check Modal */}
      <StorageCheckModal
        isOpen={showStorageConnectionModal}
        onClose={() => setShowStorageConnectionModal(false)}
        onContinue={() => {
          localStorage.setItem('learnnect_has_uploaded', 'true');
          setShowStorageConnectionModal(false);
        }}
      />

      {/* Duplicate File Modal */}
      <DuplicateFileModal
        isOpen={showDuplicateModal}
        onClose={() => {
          setShowDuplicateModal(false);
          setDuplicateFileInfo(null);
        }}
        onUploadNew={handleDuplicateUploadNew}
        onUseExisting={handleDuplicateImportExisting}
        fileName={duplicateFileInfo?.newFile?.name || ''}
        fileType="resume"
        existingFileInfo={duplicateFileInfo?.existingResume ? {
          name: duplicateFileInfo.existingResume.originalName,
          uploadedAt: formatDate(duplicateFileInfo.existingResume.uploadedAt),
          size: resumeService.formatFileSize(duplicateFileInfo.existingResume.fileSize)
        } : undefined}
      />

    </>
  );
};

export default ResumeSection;
