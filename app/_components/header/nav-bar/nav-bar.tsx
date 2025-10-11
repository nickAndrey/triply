'use client';

import { useState } from 'react';

import { PanelRight, Plane, X } from 'lucide-react';

import { useRequest } from '@providers/request-context';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@chadcn/components/ui/alert-dialog';
import { Badge } from '@chadcn/components/ui/badge';
import { Button } from '@chadcn/components/ui/button';
import { DialogDescription, DialogTitle } from '@chadcn/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger } from '@chadcn/components/ui/drawer';

import { NavItems } from '@components/header/nav-bar/components/nav-items';
import { NavBarItem } from '@components/header/nav-bar/types/nav-bar-item';

import { useTripActions } from '@/app/_hooks/use-trip-actions';

type NavBarProps = {
  navbarItems: NavBarItem[];
};

export function NavBar({ navbarItems }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const { isPending } = useRequest();

  const actions = useTripActions();

  const { alertDialogProps } = actions;

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

        <AlertDialog open={alertDialogProps.open} onOpenChange={actions.handleDialogOnOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alertDialogProps.title}</AlertDialogTitle>
              <AlertDialogDescription>{alertDialogProps.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={alertDialogProps.action}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DrawerContent>
    </Drawer>
  );
}
