import { TravelItineraryForm } from '@/app/_types/supabase-update-payload';

export type SuggestionFormFields = TravelItineraryForm & {
  travelDates?: string[];
  currentDay?: number;
  context?: {
    visitedPlaces?: string[];
    themesUsed?: string[];
    previousDaySummaries?: string[];
  };
};
