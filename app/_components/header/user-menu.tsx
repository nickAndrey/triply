'use client';

import { LoaderCircle, User as UserIcon } from 'lucide-react';

import { useAuth } from '@providers/auth-context';
import { useRequest } from '@providers/request-context';

import { Button } from '@chadcn/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@chadcn/components/ui/dropdown-menu';

export function UserMenu() {
  const { handleLogOut, user } = useAuth();
  const { isPending } = useRequest();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full" size="icon" aria-label="open user menu">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel className="text-muted-foreground">{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut}>
          {isPending && <LoaderCircle className="animate-spin" />}
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
