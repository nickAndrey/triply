'use client';

import { Button } from '@chadcn/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@chadcn/components/ui/drawer';
import { PanelRight } from 'lucide-react';
import { ReactNode, useState } from 'react';

type NavBarProps = {
  children?: ReactNode;
};

export function NavBar({ children }: NavBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="rounded-full" size="icon">
          <PanelRight />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="left-2! top-2! bottom-2! rounded-2xl after:content-none!">
        {children || (
          <DrawerHeader>
            <DrawerTitle>There is no any items to show at that moment.</DrawerTitle>
            <DrawerDescription>Add place you want to visit</DrawerDescription>
          </DrawerHeader>
        )}
      </DrawerContent>
    </Drawer>
  );
}
