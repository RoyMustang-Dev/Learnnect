import React, { useState, useEffect } from 'react';
import { googleDriveService } from '../../services/googleDriveService';
import { Cloud, Key, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const GoogleDriveSetup: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    checkSignInStatus();
  }, []);

  const checkSignInStatus = async () => {
    try {
      await googleDriveService.initialize();
      setIsSignedIn(googleDriveService.isSignedIn());
      setSetupComplete(googleDriveService.isSignedIn());
    } catch (error) {
      console.error('Failed to check Google Drive status:', error);
    }
  };

  const handleSignIn = async () => {
    setIsInitializing(true);
    try {
      const success = await googleDriveService.signIn();
      if (success) {
        setIsSignedIn(true);
        setSetupComplete(true);
      }
    } catch (error) {
      console.error('Google Drive sign-in failed:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleDriveService.signOut();
      setIsSignedIn(false);
      setSetupComplete(false);
    } catch (error) {
      console.error('Google Drive sign-out failed:', error);
    }
  };

  if (setupComplete) {
    return (
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-300">
              Google Drive Connected
            </h3>
            <p className="text-sm text-green-400/80">
              Resume uploads will be stored in your Google Drive
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-green-400 hover:text-green-300 underline transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-neon-blue/10 to-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-start space-x-4">
        <Cloud className="h-8 w-8 text-neon-cyan mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-2">
            Connect Google Drive for Resume Storage
          </h3>

          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2 text-sm text-cyan-200">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>15GB free storage per Google account</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-cyan-200">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Automatic folder creation: Learnnect_YourName_UniqueID</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-cyan-200">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Secure access - only your resume files</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-cyan-200">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>No billing required - completely free</span>
            </div>
          </div>

          {!isSignedIn && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <div className="flex items-start space-x-2">
                <Key className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Setup Required:</p>
                  <p>You need to configure Google Drive API credentials first.</p>
                  <a 
                    href="https://console.developers.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-yellow-700 hover:text-yellow-800 underline mt-1"
                  >
                    <span>Get API credentials</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={isInitializing}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all duration-300"
          >
            {isInitializing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Cloud className="h-4 w-4" />
                <span>Connect Google Drive</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveSetup;
