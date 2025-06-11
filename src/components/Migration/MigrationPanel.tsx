import React, { useState } from 'react';
import { firebaseMigration } from '../../utils/firebaseMigration';
import { Download, Upload, Database, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const MigrationPanel: React.FC = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupStatus(null);
    
    try {
      await firebaseMigration.backupAllData();
      setBackupStatus('✅ Backup completed successfully! File downloaded.');
    } catch (error) {
      setBackupStatus(`❌ Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setRestoreStatus(null);
    
    try {
      const success = await firebaseMigration.restoreAllData();
      if (success) {
        setRestoreStatus('✅ Data restored successfully to new Firebase project!');
      } else {
        setRestoreStatus('❌ Restoration failed. Check console for details.');
      }
    } catch (error) {
      setRestoreStatus(`❌ Restoration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setRestoreStatus(null);

    try {
      const backup = await firebaseMigration.loadBackupFromFile(file);
      const success = await firebaseMigration.restoreAllData(backup);
      
      if (success) {
        setRestoreStatus('✅ Data restored from uploaded backup file!');
      } else {
        setRestoreStatus('❌ Restoration failed. Check console for details.');
      }
    } catch (error) {
      setRestoreStatus(`❌ File restoration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRestoring(false);
    }
  };

  const backupSummary = firebaseMigration.getBackupSummary();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-gray-900 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5 text-yellow-400" />
          <h3 className="text-white font-medium">Firebase Migration</h3>
        </div>

        <div className="space-y-4">
          {/* Warning */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium mb-1">Before switching Firebase projects:</p>
              <p>1. Backup your current data</p>
              <p>2. Create new Firebase project</p>
              <p>3. Update config & restore data</p>
            </div>
          </div>

          {/* Current Backup Status */}
          {backupSummary && (
            <div className="flex items-center space-x-2 p-2 bg-green-500/10 border border-green-500/20 rounded">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-200">{backupSummary}</span>
            </div>
          )}

          {/* Backup Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Step 1: Backup Current Data</h4>
            <button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isBackingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Backing up...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Backup Data</span>
                </>
              )}
            </button>
            {backupStatus && (
              <p className="text-xs text-gray-300">{backupStatus}</p>
            )}
          </div>

          {/* Restore Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Step 3: Restore to New Project</h4>
            
            {/* Restore from localStorage */}
            <button
              onClick={handleRestore}
              disabled={isRestoring || !backupSummary}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Restoring...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Restore from Backup</span>
                </>
              )}
            </button>

            {/* Restore from file */}
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isRestoring}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 border-2 border-dashed border-gray-500">
                <Upload className="h-4 w-4" />
                <span className="text-sm">Or upload backup file</span>
              </div>
            </div>

            {restoreStatus && (
              <p className="text-xs text-gray-300">{restoreStatus}</p>
            )}
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
            <p className="font-medium mb-1">Step 2: Update Firebase Config</p>
            <p>1. Create new Firebase project with us-central1</p>
            <p>2. Update src/config/firebase.ts with new credentials</p>
            <p>3. Then restore your data above</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationPanel;
