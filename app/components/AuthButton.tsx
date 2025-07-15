'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut, User } from 'lucide-react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span className="text-white text-sm">Loading...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg">
          <User size={16} className="text-green-400" />
          <span className="text-white text-sm">{session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
    >
      <LogIn size={16} />
      Sign In with Google
    </button>
  );
}