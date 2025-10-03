'use client';

import { useRequest } from '@/app/_providers/request-context';
import { TravelItineraryDay } from '@/app/_types/supabase-update-payload';
import { Badge } from '@/chadcn/components/ui/badge';
import { Button } from '@/chadcn/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/chadcn/components/ui/drawer';
import { PanelRight, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from './nav-link';

type NavBarProps = {
  suggestions: {
    id: string;
    metadata: TravelItineraryDay['metadata'];
  }[];
};

export function NavBar({ suggestions }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const { isPending } = useRequest();

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="rounded-full relative" size="icon" aria-label="open nav bar">
          <PanelRight />
          {isPending && <Badge variant="default" className="p-0 size-2 absolute top-[-2px] right-[-2px]" />}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="mb-4">
          <DrawerClose autoFocus asChild className="ml-auto mb-4">
            <Button variant="secondary" size="icon" className="rounded-full">
              <X />
            </Button>
          </DrawerClose>
          {suggestions.length ? (
            <>
              <DrawerTitle>Here is a history of your travels or suggestions of your travels</DrawerTitle>
              <DrawerDescription>Click on an item to visit the page</DrawerDescription>
            </>
          ) : (
            <>
              <DrawerTitle>There is no any items to show at that moment.</DrawerTitle>
              <DrawerDescription>Add places you want to visit</DrawerDescription>
            </>
          )}
        </DrawerHeader>

        <ul className="flex flex-col gap-2 px-4 py-4 w-full">
          {suggestions.map(({ id, metadata }) => {
            return (
              <li key={id}>
                <NavLink
                  href={metadata?.slug}
                  onNavigate={() => setOpen(false)}
                  label={`${metadata.destination}`}
                >{`${metadata.destination} — ${metadata.season}`}</NavLink>
              </li>
            );
          })}
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
