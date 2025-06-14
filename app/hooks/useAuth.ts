'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useRequireAuth(redirectUrl?: string) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      // Not authenticated, could redirect or show login
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
  }, [session, status, redirectUrl]);

  return {
    session,
    loading: status === 'loading',
    authenticated: !!session,
  };
}