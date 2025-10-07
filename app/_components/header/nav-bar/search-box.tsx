'use client';

import { Button } from '@/chadcn/components/ui/button';
import { Input } from '@/chadcn/components/ui/input';
import { Search, X } from 'lucide-react';
import { KeyboardEventHandler } from 'react';

type SearchBoxProps = {
  searchValue: string;
  onChange: (value: string) => void;
  clearValue: () => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
};

export function SearchBox({ searchValue, onChange, clearValue, onKeyDown }: SearchBoxProps) {
  return (
    <div className="relative">
      <Input className="pl-9" value={searchValue} onChange={(e) => onChange(e.target.value)} onKeyDown={onKeyDown} />
      <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2" />
      <Button
        variant="secondary"
        size="icon"
        className="w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2"
        onClick={clearValue}
      >
        <X />
      </Button>
    </div>
  );
}
