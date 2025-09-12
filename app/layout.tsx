import { SupabaseJobSubscriber } from '@/app/_components/supabase-job-subscriber';
import { RequestProvider } from '@/app/_providers/request-context';
import { Toaster } from '@chadcn/components/ui/sonner';
import { ThemeProvider } from '@chadcn/components/ui/theme-provider';
import { Header } from '@components/header/header';
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Header />
            <SupabaseJobSubscriber />
            <Toaster position="top-right" />
          </ThemeProvider>
        </RequestProvider>
      </body>
    </html>
  );
}
