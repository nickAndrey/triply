'use client';

import { useTheme } from 'next-themes';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      className="rounded-full"
      size="icon"
      onClick={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
    >
      <Moon className="hidden dark:block" />
      <Sun className="block dark:hidden" />
    </Button>
  );
}
