'use client';

import Link from 'next/link';

import { Home } from 'lucide-react';

import { useAuth } from '@providers/auth-context';

import { Button } from '@chadcn/components/ui/button';

import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';
import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';
import { TripCore } from '@/app/_types/trip/trip-core';

import { NavBar } from './nav-bar/nav-bar';
import { ThemeSwitcher } from './theme-switcher';
import { UserMenu } from './user-menu';

type HeaderProps = {
  itineraries: TravelItineraryRow[];
};

export function Header({ itineraries }: HeaderProps) {
  const { user } = useAuth();

  const navbarItems = itineraries?.map((item) => {
    return {
      trip_core: item.trip_core as TripCore,
      form: item.form as TravelItineraryForm,
      createdAt: item.created_at,
      id: item._id || item.id,
    };
  });

  console.log(itineraries);

  const homeLink = (
    <Link href="/">
      <Button size="icon" variant="outline" className="rounded-full" aria-label="home">
        <Home />
      </Button>
    </Link>
  );

  return (
    <header className="flex flex-col max-w-max gap-2 items-center justify-between bg-secondary rounded-2xl p-2 fixed right-4 top-1/2 translate-y-[-1/2] z-10 shadow-xl/20">
      {user && (
        <>
          {homeLink}
          <NavBar navbarItems={navbarItems} />
          <UserMenu />
        </>
      )}
      <ThemeSwitcher />
    </header>
  );
}
