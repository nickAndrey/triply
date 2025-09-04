import { createClient } from '@/utils/supabase/server';
import { NavBar } from './_components/nav-bar';
import { ThemeSwitcher } from './_components/theme-switcher';
import { UserMenu } from './_components/user-menu';

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex flex-col max-w-max gap-2 items-center justify-between bg-secondary rounded-2xl p-2 fixed right-4 top-1/2 translate-y-[-1/2] z-10 shadow-xl/20">
      {user && (
        <>
          <NavBar />
          <UserMenu />
        </>
      )}
      <ThemeSwitcher />
    </header>
  );
}
