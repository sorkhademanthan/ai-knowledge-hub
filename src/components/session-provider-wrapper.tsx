'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SessionProviderWrapper({ children }: Props) {
  return (
    <SessionProvider
      refetchInterval={0} // Disable auto refetch to avoid issues
      refetchOnWindowFocus={false} // Disable refetch on window focus
    >
      {children}
    </SessionProvider>
  );
}
