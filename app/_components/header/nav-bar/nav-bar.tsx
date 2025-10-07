'use client';

import { NavLink } from '@/app/_components/header/nav-bar/nav-link';
import { SearchBox } from '@/app/_components/header/nav-bar/search-box';
import { useRequest } from '@/app/_providers/request-context';
import { TripPlan } from '@/app/_types/trip-plan';
import { Badge } from '@/chadcn/components/ui/badge';
import { Button } from '@/chadcn/components/ui/button';
import { DialogDescription, DialogTitle } from '@/chadcn/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger } from '@/chadcn/components/ui/drawer';
import { PanelRight, Plane, X } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

type NavBarProps = {
  suggestions: {
    id: string;
    details: TripPlan;
  }[];
};

export function NavBar({ suggestions }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const { isPending } = useRequest();

  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const filterNavItems = () => {
    const regex = new RegExp(searchValue, 'i');
    return suggestions.filter((item) => regex.test(item.details.city));
  };

  const ulRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!ulRef.current) return;

    const links = Array.from(ulRef.current.querySelectorAll('a'));

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % links.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + links.length) % links.length);
        break;
      case 'Enter':
        (links[activeIndex] as HTMLAnchorElement)?.click();
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    const links = ulRef.current?.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    links?.forEach((link, idx) => {
      link.classList.toggle('bg-blue-100', idx === activeIndex);
    });
  }, [activeIndex]);

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
              {suggestions.length > 0 ? 'Your Trips' : 'No Trips Yet'}
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {suggestions.length > 0
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

        <ul className="flex flex-col gap-1 px-3 pb-4 w-full overflow-auto" ref={ulRef}>
          <li className="py-2 sticky top-0 z-10 bg-background">
            <SearchBox
              searchValue={searchValue}
              onChange={setSearchValue}
              onKeyDown={handleKeyDown}
              clearValue={() => setSearchValue('')}
            />
          </li>

          {filterNavItems().map(({ id, details }) => {
            const baseCity = details.city || details.destination.split(',')[0];
            const duration = `${details.tripDurationDays}-day`;
            const subtitle = `${duration} ${details.companions.type.toLowerCase()} trip • ${details.season.toLowerCase()}`;

            return (
              <li key={id}>
                <NavLink
                  href={`/${details.slug}`}
                  label={baseCity}
                  subtitle={subtitle}
                  icon={<Plane className="w-4 h-4" />}
                />
              </li>
            );
          })}
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
