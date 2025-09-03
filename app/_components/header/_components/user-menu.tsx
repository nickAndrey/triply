'use client';

import { Button } from '@/chadcn/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/chadcn/components/ui/dropdown-menu';
import { createClient } from '@/utils/supabase/client';
import { User } from 'lucide-react';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

export function UserMenu() {
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
    }

    redirect('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full" size="icon">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel className="text-muted-foreground">
          {supabase.auth.getUser().then((it) => it.data.user?.email)}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
