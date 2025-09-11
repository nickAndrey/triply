import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@chadcn/components/ui/carousel';
import { getSuggestions } from '../../../_actions/get-suggestions';
import { SuggestionItem } from './suggestion-item';

export async function SuggestionsCarousel() {
  const suggestions = await getSuggestions();

  if (suggestions.length === 0) {
    return <SuggestionItem suggestion={null} />;
  }

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
        <CarouselPrevious
          variant="default"
          size="icon"
          className="hidden md:flex static translate-0"
        />
        <CarouselNext variant="default" size="icon" className="hidden md:flex static translate-0" />
      </div>
    </Carousel>
  );
}
