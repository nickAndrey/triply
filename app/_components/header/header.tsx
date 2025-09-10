import { Button } from '@/chadcn/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { NavBar } from './_components/nav-bar';
import { ThemeSwitcher } from './_components/theme-switcher';
import { UserMenu } from './_components/user-menu';

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: suggestionFields } = await supabase
    .from('personal_travel_suggestions')
    .select('id,destination,travel_dates,article_title,slug')
    .eq('user_id', user.id);

  let links = null;

  if (suggestionFields) {
    links = suggestionFields.map((item) => {
      return (
        <li key={item.id}>
          <Link
            href={item.slug}
            className="flex px-4 py-2 bg-primary/60 rounded-md"
          >{`${item.destination} — ${new Date(item.travel_dates[0]).getFullYear()}`}</Link>
        </li>
      );
    });
  }

  return (
    <header className="flex flex-col max-w-max gap-2 items-center justify-between bg-secondary rounded-2xl p-2 fixed right-4 top-1/2 translate-y-[-1/2] z-10 shadow-xl/20">
      {user && (
        <>
          <Link href="/">
            <Button size="icon" variant="outline" className="rounded-full">
              <Home />
            </Button>
          </Link>
          <NavBar>
            {links && <ul className="flex flex-col gap-2 px-4 py-4 w-full">{links}</ul>}
          </NavBar>
          <UserMenu />
        </>
      )}
      <ThemeSwitcher />
    </header>
  );
}
