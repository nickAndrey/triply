import { Suggestion } from '@/app/_types/suggestion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@chadcn/components/ui/carousel';
import { SuggestionItem } from './suggestion-item';

type SuggestionsProps = {
  suggestions: Suggestion[];
};

export function Suggestions({ suggestions }: SuggestionsProps) {
  return (
    <Carousel
      opts={{
        align: suggestions.length > 0 ? 'start' : 'center',
        loop: true,
      }}
    >
      <CarouselContent>
        {suggestions.map((suggestion) => (
          <CarouselItem key={suggestion.id} className="basis-1/1 sm:basis-1/2 lg:basis-1/3">
            <SuggestionItem suggestion={suggestion} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex gap-4 mt-4 max-w-max ml-auto">
        <CarouselPrevious variant="default" className="hidden md:flex static translate-0" />
        <CarouselNext variant="default" className="hidden md:flex static translate-0" />
      </div>
    </Carousel>
  );
}
