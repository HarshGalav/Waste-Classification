'use client';

import { getProviders, signIn, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recycle, LogIn } from 'lucide-react';

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
      setLoading(false);
    };

    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/app');
      }
    };

    fetchProviders();
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="p-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl w-fit mx-auto mb-4">
              <Recycle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to EcoWaste AI</h1>
            <p className="text-gray-400">Sign in to start making environmental impact</p>
          </div>

          {providers && Object.values(providers).map((provider: any) => (
            <div key={provider.name} className="mb-4">
              <button
                onClick={() => signIn(provider.id, { callbackUrl: '/app' })}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                <LogIn size={20} />
                Sign in with {provider.name}
              </button>
            </div>
          ))}

          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}