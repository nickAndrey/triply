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
      className="m-auto max-w-[65%]"
    >
      <CarouselContent>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <CarouselItem key={suggestion.id} className="sm:basis-1/2 md:basis-1/3 xl:basis-1/4">
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
      <CarouselPrevious className="" />
      <CarouselNext />
    </Carousel>
  );
}
