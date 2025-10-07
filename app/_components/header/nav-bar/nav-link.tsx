'use client';

import { cn } from '@/chadcn/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type NavLinkProps = {
  href: string;
  label: string;
  subtitle?: string;
  icon?: ReactNode;
  onNavigate?: () => void;
};

export function NavLink({ href, label, subtitle, icon, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={`open suggestion — ${label}`}
      prefetch
      className={cn(
        'relative flex flex-col gap-0.5 px-3 py-2 rounded-lg transition-all overflow-hidden',
        'hover:bg-accent/70',
        isActive && 'bg-primary/10 border border-primary/20 shadow-sm'
      )}
    >
      {isActive && <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-xl" />}

      <div className="flex items-center gap-2">
        {icon && (
          <span className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')}>{icon}</span>
        )}
        <span className={cn('font-medium text-sm', isActive ? 'text-primary' : 'text-foreground')}>{label}</span>
      </div>

      {subtitle && (
        <span className={cn('text-xs pl-6 leading-tight', isActive ? 'text-primary/70' : 'text-muted-foreground')}>
          {subtitle}
        </span>
      )}
    </Link>
  );
}
