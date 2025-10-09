import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';
import { Card } from '@chadcn/components/ui/card';
import { cn } from '@chadcn/lib/utils';

export function SuggestionSkeleton() {
  return (
    <div className="">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className={cn(
              'rounded-lg overflow-hidden shadow-md bg-card animate-pulse px-2',
              index === 0 ? 'block' : '',
              index === 1 ? 'hidden sm:block' : '',
              index === 2 ? 'hidden lg:block' : ''
            )}
          >
            <div className="h-44 bg-muted-foreground rounded-2xl mb-4" />
            <div>
              <div className="h-4 bg-muted-foreground rounded w-3/4 mb-2" />
              <div className="h-2 bg-muted-foreground rounded w-5/6 mb-1" />
              <div className="h-2 bg-muted-foreground rounded w-full mb-1" />
              <div className="h-2 bg-muted-foreground rounded w-4/6" />
            </div>
          </Card>
        ))}
      </div>
      <div className="flex gap-4 mt-4 max-w-max ml-auto">
        <Button
          variant="default"
          size="icon"
          disabled
          className="hidden md:flex static translate-0 animate-pulse rounded-full"
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="default"
          size="icon"
          disabled
          className="hidden md:flex static translate-0 animate-pulse rounded-full"
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
