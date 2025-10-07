'use client';

import { Button } from '@/chadcn/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/chadcn/components/ui/dropdown-menu';
import { cn } from '@/chadcn/lib/utils';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type NavLinkProps = {
  href: string;
  label: string;
  contextMenuConfig: {
    name: string;
    label: string;
    onClick: () => void;
  }[];
  subtitle?: string;
  icon?: ReactNode;
  onNavigate?: () => void;
};

export function NavLink({ href, label, contextMenuConfig, subtitle, icon, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      prefetch
      aria-label={`open suggestion — ${label}`}
      className={cn(
        'relative flex justify-between items-center px-3 py-2 rounded-lg transition-all overflow-hidden',
        'hover:bg-accent/70',
        isActive && 'bg-primary/10 border border-primary/20 shadow-sm'
      )}
    >
      {/* active border */}
      {isActive && <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-xl" />}

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {icon && (
            <span className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')}>{icon}</span>
          )}
          <span className={cn('font-medium text-sm truncate', isActive ? 'text-primary' : 'text-foreground')}>
            {label}
          </span>
        </div>

        {subtitle && (
          <span
            className={cn(
              'text-xs pl-6 leading-tight truncate',
              isActive ? 'text-primary/70' : 'text-muted-foreground'
            )}
          >
            {subtitle}
          </span>
        )}
      </div>

      <div onClick={(e) => e.preventDefault()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom">
            {contextMenuConfig.map((item) => (
              <DropdownMenuItem key={item.name} onClick={item.onClick}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
}
