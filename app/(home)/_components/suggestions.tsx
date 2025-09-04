import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@chadcn/components/ui/carousel';
import { SuggestionItem, SuggestionItemProps } from './suggestion-item';

type SuggestionsProps = {
  suggestions: (SuggestionItemProps & { id: string })[];
};

export function Suggestions({ suggestions }: SuggestionsProps) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <CarouselItem
              key={suggestion.id}
              className="basis-1/1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <SuggestionItem
                imgSrc={suggestion.imgSrc}
                title={suggestion.title}
                description={suggestion.description}
              />
            </CarouselItem>
          ))
        ) : (
          <CarouselItem className="sm:basis-1/2 md:basis-1/3 xl:basis-1/4">
            <p>No items to show</p>
          </CarouselItem>
        )}
      </CarouselContent>

      <div className="flex gap-4 mt-4 max-w-max ml-auto">
        <CarouselPrevious className="hidden md:flex static translate-0" />
        <CarouselNext className="hidden md:flex static translate-0" />
      </div>
    </Carousel>
  );
}
