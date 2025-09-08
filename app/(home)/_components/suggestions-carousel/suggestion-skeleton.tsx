import { Button } from '@/chadcn/components/ui/button';
import { Card } from '@/chadcn/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function SuggestionSkeleton() {
  return (
    <div className="">
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="basis-1/1 sm:basis-1/2 lg:basis-1/3">
            <Card className="rounded-lg overflow-hidden shadow-md bg-card animate-pulse px-2">
              <div className="h-44 bg-muted-foreground rounded-2xl" />
              <div className="">
                <div className="h-4 bg-muted-foreground rounded w-3/4 mb-2" />
                <div className="h-2 bg-muted-foreground rounded w-5/6 mb-1" />
                <div className="h-2 bg-muted-foreground rounded w-full mb-1" />
                <div className="h-2 bg-muted-foreground rounded w-5/7" />
              </div>
            </Card>
          </div>
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
