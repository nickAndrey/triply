import Link from 'next/link';

import { Home } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';
import { TripCore } from '@/app/_types/trip/trip-core';
import { createClient } from '@/utils/supabase/server';

import { NavBar } from './nav-bar/nav-bar';
import { ThemeSwitcher } from './theme-switcher';
import { UserMenu } from './user-menu';

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tripDetails } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .select('trip_core, id, created_at, form')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  const navbarItems = tripDetails?.map((item) => {
    return {
      trip_core: item.trip_core as TripCore,
      form: item.form as TravelItineraryForm,
      createdAt: item.created_at,
      id: item.id,
    };
  });

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
