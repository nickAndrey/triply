'use client';

import Link from 'next/link';

import { Home } from 'lucide-react';

import { useAuth } from '@providers/auth-context';

import { Button } from '@chadcn/components/ui/button';

import { NavBar } from './nav-bar/nav-bar';
import { ThemeSwitcher } from './theme-switcher';
import { UserMenu } from './user-menu';

export function Header() {
  const { user } = useAuth();

  // const { data: tripDetails } = await supabase
  //   .from(DB_TABLES.travel_itineraries)
  //   .select('trip_core, id, created_at, form')
  //   .eq('user_id', user?.id)
  //   .order('created_at', { ascending: false });

  // const navbarItems = tripDetails?.map((item) => {
  //   return {
  //     trip_core: item.trip_core as TripCore,
  //     form: item.form as TravelItineraryForm,
  //     createdAt: item.created_at,
  //     id: item.id,
  //   };
  // });

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
          <NavBar navbarItems={[]} />
          <UserMenu />
        </>
      )}
      <ThemeSwitcher />
    </header>
  );
}
