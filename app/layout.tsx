import { Header } from '@/app/_components/header/header';

import { RequestProvider } from '@/app/_providers/request-context';
import { SupabaseSubscriptionProvider } from '@/app/_providers/supabase-subscriptions-context';
import { Toaster } from '@/chadcn/components/ui/sonner';
import { ThemeProvider } from '@/chadcn/components/ui/theme-provider';
import { Nunito } from 'next/font/google';
import { ReactNode } from 'react';
import './_styles/globals.css';

const nunito = Nunito({
  subsets: [],
});

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={nunito.className}>
        <RequestProvider>
          <SupabaseSubscriptionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Header />
              <Toaster position="top-right" richColors expand />
            </ThemeProvider>
          </SupabaseSubscriptionProvider>
        </RequestProvider>
      </body>
    </html>
  );
}
