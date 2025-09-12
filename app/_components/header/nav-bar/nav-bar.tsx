'use client';

import { useRequest } from '@/app/_providers/request-context';
import { Badge } from '@/chadcn/components/ui/badge';
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
import { useState } from 'react';
import { NavLink } from './nav-link';

type NavBarProps = {
  suggestions: {
    id: string;
    destination: string;
    travel_dates: string;
    article_title: string;
    slug: string;
  }[];
};

export function NavBar({ suggestions }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const { isPending } = useRequest();

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full relative"
          size="icon"
        >
          <PanelRight />
          {isPending && (
            <Badge
              variant="default"
              className="p-0 size-2 absolute top-[-2px] right-[-2px]"
            />
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="left-2! top-2! bottom-2! rounded-2xl after:content-none!">
        <DrawerHeader>
          {suggestions ? (
            <>
              <DrawerTitle>
                Here is a history of your travels or suggestions of your
                travels
              </DrawerTitle>
              <DrawerDescription>
                Click on an item to visit the page
              </DrawerDescription>
            </>
          ) : (
            <>
              <DrawerTitle>
                There is no any items to show at that moment.
              </DrawerTitle>
              <DrawerDescription>
                Add places you want to visit
              </DrawerDescription>
            </>
          )}
        </DrawerHeader>

        <ul className="flex flex-col gap-2 px-4 py-4 w-full">
          {suggestions.map((item) => {
            return (
              <li key={item.id}>
                <NavLink
                  href={item.slug}
                  onNavigate={() => setOpen(false)}
                >{`${item.destination} — ${new Date(item.travel_dates[0]).getFullYear()}`}</NavLink>
              </li>
            );
          })}
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
