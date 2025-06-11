import React, { useState } from 'react';
import { testFirebaseConnection, checkStorageRules } from '../../utils/firebaseTest';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react';

const FirebaseDebug: React.FC = () => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTests = async () => {
    setTesting(true);
    try {
      console.log('🔍 Running Firebase connectivity tests...');
      const testResults = await testFirebaseConnection();
      setResults(testResults);
      
      // Also log storage rules info
      checkStorageRules();
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResults({
        storage: false,
        firestore: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-lg p-4 max-w-md">
        <div className="flex items-center space-x-2 mb-3">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <h3 className="text-white font-medium">Firebase Debug</h3>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm text-gray-300">
            <p>User: {user?.email || 'Not logged in'}</p>
            <p>Auth: {user ? '✅ Authenticated' : '❌ Not authenticated'}</p>
          </div>
          
          <button
            onClick={runTests}
            disabled={testing}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Info className="h-4 w-4" />
                <span>Test Firebase</span>
              </>
            )}
          </button>
          
          {results && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                {results.firestore ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <span className="text-gray-300">
                  Firestore: {results.firestore ? 'Working' : 'Failed'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {results.storage ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <span className="text-gray-300">
                  Storage: {results.storage ? 'Working' : 'Failed'}
                </span>
              </div>
              
              {results.errors.length > 0 && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                  <p className="text-red-300 text-xs font-medium mb-1">Errors:</p>
                  {results.errors.map((error: string, index: number) => (
                    <p key={index} className="text-red-300 text-xs">{error}</p>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
            <p className="font-medium mb-1">Quick Fixes:</p>
            <ul className="space-y-1">
              <li>• Check Firebase Storage rules</li>
              <li>• Configure CORS for localhost</li>
              <li>• Verify authentication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseDebug;
