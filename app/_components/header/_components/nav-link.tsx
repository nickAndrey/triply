'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { cn } from '../../../../chadcn/lib/utils';

type NavLinkProps = {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
};

export function NavLink({ href, children, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.match(href);

  return (
    <Link
      href={href}
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
