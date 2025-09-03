import { Toaster } from '@/chadcn/components/ui/sonner';
import { ThemeProvider } from '@/chadcn/components/ui/theme-provider';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const open_sans = Open_Sans({
  subsets: [],
});

export const metadata: Metadata = {
  title: 'Triply',
  description: 'Triply — AI-Powered Travel Planner',
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={open_sans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
