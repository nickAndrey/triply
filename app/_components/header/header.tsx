import Link from 'next/link';

import { compareDesc, parseISO } from 'date-fns';
import { Home } from 'lucide-react';

import { requireUser } from '@features/auth/utils/require-user';

import { Button } from '@chadcn/components/ui/button';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';
import { TripCore } from '@/app/_types/trip/trip-core';

import { NavBar } from './nav-bar/nav-bar';
import { ThemeSwitcher } from './theme-switcher';
import { UserMenu } from './user-menu';

export async function Header() {
  const { user, supabase } = await requireUser();

  const { data: tripDetails } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .select('trip_core, id, created_at, form')
    .eq('user_id', user.id);

  const navbarItems = tripDetails
    ?.map((item) => {
      return {
        trip_core: item.trip_core as TripCore,
        form: item.form as TravelItineraryForm,
        createdAt: item.created_at,
        id: item.id,
      };
    })
    .sort((a, b) => compareDesc(parseISO(a.createdAt), parseISO(b.createdAt)));

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
          <NavBar navbarItems={navbarItems || []} />
          <UserMenu />
        </>
      )}
      <ThemeSwitcher />
    </header>
  );
}
