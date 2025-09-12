'use client';

import { cn } from '@/chadcn/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type NavLinkProps = {
  href: string;
  children: ReactNode;
  label: string;
  onNavigate?: () => void;
};

export function NavLink({
  href,
  children,
  label,
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.match(href);

  return (
    <Link
      href={href}
      aria-label={`open suggestion — ${label}`}
      className={cn(
        'flex px-4 py-2 rounded-md hover:bg-primary/20 transition-colors',
        isActive ? 'bg-primary/60' : ''
      )}
      onNavigate={onNavigate}
      prefetch
    >
      {children}
    </Link>
  );
}
