'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { LogIn, LogOut, User } from 'lucide-react';

interface AuthButtonProps {
  variant?: 'primary' | 'secondary';
  onSignInSuccess?: () => void;
}

export default function AuthButton({ variant = 'primary', onSignInSuccess }: AuthButtonProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="px-6 py-2 bg-gray-600 text-gray-300 rounded-lg animate-pulse">
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          )}
          <span className="text-white font-medium hidden sm:block">
            {session.user?.name}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>
    );
  }

  const handleSignIn = async () => {
    const result = await signIn('google', { redirect: false });
    if (result?.ok && onSignInSuccess) {
      onSignInSuccess();
    }
  };

  const buttonClasses = variant === 'primary'
    ? "px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all transform hover:scale-105 flex items-center gap-2"
    : "px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2";

  return (
    <button onClick={handleSignIn} className={buttonClasses}>
      <LogIn size={16} />
      Sign in with Google
    </button>
  );
}