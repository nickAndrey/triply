import { DB_TABLES } from '@/app/_constants/db-tables';
import { Button } from '@/chadcn/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { NavBar } from './nav-bar/nav-bar';
import { ThemeSwitcher } from './theme-switcher';
import { UserMenu } from './user-menu';

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let suggestionFields = null;

  if (user) {
    const { data } = await supabase
      .from(DB_TABLES.personal_travel_suggestions)
      .select('id,destination,travel_dates,article_title,slug')
      .eq('user_id', user.id);

    suggestionFields = data;
  }

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
          <NavBar suggestions={suggestionFields || []} />
          <UserMenu />
        </>
      )}
      <ThemeSwitcher />
    </header>
  );
}
