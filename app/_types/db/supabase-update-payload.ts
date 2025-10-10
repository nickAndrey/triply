import { TravelItineraryRow } from './travel-itinerary-row';

export type SupabaseUpdatePayload = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: TravelItineraryRow;
  old: Partial<TravelItineraryRow>;
  errors: Record<string, unknown>;
};
