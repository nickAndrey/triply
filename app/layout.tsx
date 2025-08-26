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
    <html lang="en">
      <body className={open_sans.className}>{children}</body>
    </html>
  );
}
