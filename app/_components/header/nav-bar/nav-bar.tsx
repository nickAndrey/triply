'use client';

import { NavItems } from '@/app/_components/header/nav-bar/components/nav-items';
import { useNavBarActions } from '@/app/_components/header/nav-bar/hooks/use-nav-bar-actions';
import { NavBarItem } from '@/app/_components/header/nav-bar/types/nav-bar-item';
import { useRequest } from '@/app/_providers/request-context';
import { Badge } from '@/chadcn/components/ui/badge';
import { Button } from '@/chadcn/components/ui/button';
import { DialogDescription, DialogTitle } from '@/chadcn/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger } from '@/chadcn/components/ui/drawer';
import { PanelRight, Plane, X } from 'lucide-react';
import { useState } from 'react';

type NavBarProps = {
  navbarItems: NavBarItem[];
};

export function NavBar({ navbarItems }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const { isPending } = useRequest();

  const actions = useNavBarActions();

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="rounded-full relative" size="icon" aria-label="Open trip sidebar">
          <PanelRight />
          {isPending && <Badge variant="default" className="p-0 size-2 absolute top-[-2px] right-[-2px]" />}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
          <div>
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <Plane className="w-6 h-6 text-primary" />
              {navbarItems.length > 0 ? 'Your Trips' : 'No Trips Yet'}
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {navbarItems.length > 0
                ? 'View your saved itineraries and recent adventures.'
                : 'Start exploring — plan your first trip today!'}
            </DialogDescription>
          </div>

          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted transition-colors"
              aria-label="Close drawer"
              autoFocus
            >
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <NavItems navbarItems={navbarItems} actions={actions} />
      </DrawerContent>
    </Drawer>
  );
}
