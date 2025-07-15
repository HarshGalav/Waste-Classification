'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function TestAuth() {
  const { data: session, status } = useSession();
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    // Check if environment variables are loaded (client-side check)
    setEnvVars({
      nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set',
      hasGoogleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'Check server logs',
    });
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-2xl mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="bg-slate-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p className="mb-2"><strong>Status:</strong> {status}</p>
          {session ? (
            <div>
              <p className="mb-2"><strong>User ID:</strong> {session.user?.id}</p>
              <p className="mb-2"><strong>Name:</strong> {session.user?.name}</p>
              <p className="mb-2"><strong>Email:</strong> {session.user?.email}</p>
              <button
                onClick={() => signOut()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-4">Not signed in</p>
              <button
                onClick={() => signIn('google')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
              >
                Sign In with Google
              </button>
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Sign In (Default)
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <pre className="text-sm bg-slate-700 p-4 rounded overflow-x-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <p className="text-sm text-gray-300 mb-2">
            If you're seeing a CLIENT_FETCH_ERROR, check:
          </p>
          <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
            <li>Google Cloud Console OAuth configuration</li>
            <li>Authorized redirect URIs include: http://localhost:3000/api/auth/callback/google</li>
            <li>Environment variables are properly set</li>
            <li>NextAuth API route is accessible at /api/auth/[...nextauth]</li>
          </ul>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}