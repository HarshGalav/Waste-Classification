'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'Default':
        return 'An error occurred during authentication.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 text-center">
          <div className="p-3 bg-red-500/20 rounded-xl w-fit mx-auto mb-4">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
          
          <p className="text-gray-300 mb-6">
            {getErrorMessage(error)}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-all"
            >
              <Home size={20} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}