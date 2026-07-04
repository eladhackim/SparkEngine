'use client';

import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { SelectedIdeaProvider } from '@/providers/selected-idea-provider';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <SelectedIdeaProvider>
          {children}
          <Toaster />
        </SelectedIdeaProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
