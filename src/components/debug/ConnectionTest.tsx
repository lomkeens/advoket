import React, { useState } from 'react';
import { testSupabaseConnection } from '../../utils/testConnection';
import { CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';

const ConnectionTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);
    } catch (error) {
      setResult({ success: false, error: 'Test execution failed' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Database Connection Test</h3>
        <button
          onClick={runTest}
          disabled={testing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {testing ? (
            <>
              <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
              Run Test
            </>
          )}
        </button>
      </div>

      {result && (
        <div className={`rounded-md p-4 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? 'Connection Successful' : 'Connection Failed'}
              </h3>
              <div className={`mt-2 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                <p>{result.message || result.error}</p>
                
                {result.success && result.user && (
                  <div className="mt-3 space-y-1">
                    <p><strong>User:</strong> {result.user.email}</p>
                    {result.profile && (
                      <p><strong>Profile:</strong> {result.profile.full_name || 'No name set'}</p>
                    )}
                    {result.firmSettings ? (
                      <p><strong>Firm:</strong> {result.firmSettings.firm_name}</p>
                    ) : (
                      <p><strong>Firm:</strong> Not configured yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>This test will verify:</p>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>Basic Supabase connection</li>
          <li>User authentication status</li>
          <li>Profile existence and creation</li>
          <li>Database function accessibility</li>
          <li>Firm settings configuration</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectionTest;