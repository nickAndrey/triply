'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { EllipsisVertical } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@chadcn/components/ui/dropdown-menu';
import { cn } from '@chadcn/lib/utils';

import { InputRenameNavItem } from '@components/header/nav-bar/components/input-rename-nav-item/input-rename-nav-item';
import { useInputRenameNavItem } from '@components/header/nav-bar/components/input-rename-nav-item/use-input-rename-nav-item';
import { NavBarItem } from '@components/header/nav-bar/types/nav-bar-item';

import { useTripActions } from '@/app/_hooks/use-trip-actions';

type NavLinkProps = {
  href: string;
  label: string;
  subtitle?: string;
  icon?: ReactNode;
  actions: ReturnType<typeof useTripActions>;
  navBarItem: NavBarItem;
  onNavigate?: () => void;
};

export function NavLink({ href, label, subtitle, icon, actions, navBarItem, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const isEditMode = actions.editingItemId === navBarItem.id;

  const renameInputState = useInputRenameNavItem({
    navItemId: navBarItem.id,
    isEditMode,
    actions,
    label,
  });

  return (
    <Link
      onClick={isEditMode ? (e) => e.preventDefault() : onNavigate}
      href={href}
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
          {actions.editingItemId === navBarItem.id ? (
            <InputRenameNavItem {...renameInputState} />
          ) : (
            <span className={cn('font-medium text-sm truncate', isActive ? 'text-primary' : 'text-foreground')}>
              {renameInputState.linkLabel}
            </span>
          )}
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
          <DropdownMenuContent align="end" side="bottom" onCloseAutoFocus={(e) => e.preventDefault()}>
            {actions.actionsConfig.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => item.action(navBarItem)}
                className={cn(
                  item.label === 'Delete' && 'text-destructive hover:!bg-destructive/20 hover:!text-destructive'
                )}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
}
