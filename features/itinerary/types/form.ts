import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';

export type SuggestionFormFields = TravelItineraryForm & {
  travelDates?: string[];
  currentDay?: number;
  toneStyle?: 'Vivid' | 'Historical' | 'Balanced';
  context?: {
    visitedPlaces?: string[];
    themesUsed?: string[];
    previousDaySummaries?: string[];
  };
};
