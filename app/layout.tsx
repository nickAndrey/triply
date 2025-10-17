import { ReactNode } from 'react';

import { Geist } from 'next/font/google';

import { ItineraryGenerationSubscriberProvider } from '@providers/itinerary-generation-subscriber-context';
import { RequestProvider } from '@providers/request-context';

import { Toaster } from '@chadcn/components/ui/sonner';
import { ThemeProvider } from '@chadcn/components/ui/theme-provider';

import { Header } from '@components/header/header';
import { SupabaseMessageFactory } from '@components/supabase-message-factory';

import './_styles/globals.css';

const geist = Geist({
  subsets: [],
});

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={geist.className}>
        <RequestProvider>
          <ItineraryGenerationSubscriberProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Header />
              <Toaster position="top-right" richColors expand />
              <SupabaseMessageFactory />
            </ThemeProvider>
          </ItineraryGenerationSubscriberProvider>
        </RequestProvider>
      </body>
    </html>
  );
}
