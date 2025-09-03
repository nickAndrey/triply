import { UserMenu } from './components/user-menu';

export function Header() {
  return (
    <header className="flex items-center justify-between bg-secondary rounded-2xl px-3 py-2">
      <UserMenu />
    </header>
  );
}
