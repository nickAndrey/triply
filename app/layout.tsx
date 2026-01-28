import { ReactNode } from 'react';

import { Geist } from 'next/font/google';

import { AuthProvider } from '@providers/auth-context';
import { ItineraryGenerationSubscriberProvider } from '@providers/itinerary-generation-subscriber-context';
import { RequestProvider } from '@providers/request-context';
import { SocketProvider } from '@providers/socket-context';

import { Toaster } from '@chadcn/components/ui/sonner';
import { ThemeProvider } from '@chadcn/components/ui/theme-provider';

import { Header } from '@components/header/header';
import { ItineraryStatusDialog } from '@components/ItineraryStatusDialog';
import { SupabaseStatusDialog } from '@components/supabase-status-dialog';

import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';
import { API_PATHS } from '@/constants/paths';
import { serverApiClient } from '@/utils/api/api-client-server';
import { requireAuth } from '@/utils/api/require-auth';

import './_styles/globals.css';

const geist = Geist({
  subsets: [],
});

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const {
    data: { itineraries },
  } = await requireAuth(() =>
    serverApiClient.get<{ data: { itineraries: TravelItineraryRow[] } }>(API_PATHS.itinerary.getAll)
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={geist.className}>
        <RequestProvider>
          <AuthProvider>
            <SocketProvider>
              <ItineraryGenerationSubscriberProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  {children}
                  <Header itineraries={itineraries} />
                  <Toaster position="top-right" richColors expand />
                  <SupabaseStatusDialog />
                  <ItineraryStatusDialog />
                </ThemeProvider>
              </ItineraryGenerationSubscriberProvider>
            </SocketProvider>
          </AuthProvider>
        </RequestProvider>
      </body>
    </html>
  );
}
