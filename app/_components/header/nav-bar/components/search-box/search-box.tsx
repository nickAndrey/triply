'use client';

import { useSearchBox } from '@/app/_components/header/nav-bar/components/search-box/use-search-box';
import { Button } from '@/chadcn/components/ui/button';
import { Input } from '@/chadcn/components/ui/input';
import { Search, X } from 'lucide-react';

type Props = ReturnType<typeof useSearchBox> & {};

export function SearchBox(props: Props) {
  return (
    <div className="relative">
      <Input
        className="pl-9"
        value={props.searchValue}
        onChange={(e) => props.setSearchValue(e.target.value)}
        onKeyDown={props.handleKeyDown}
      />
      <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2" />
      <Button
        variant="secondary"
        size="icon"
        className="w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2"
        onClick={props.handleClearValue}
      >
        <X />
      </Button>
    </div>
  );
}
