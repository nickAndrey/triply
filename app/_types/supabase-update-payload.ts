import { TripPlan } from '@/app/_types/trip-plan';

export type TravelItineraryForm = {
  activityIntensity: string;
  adults?: { adult: number }[];
  budget: '$' | '$$' | '$$$';
  children?: { child: number; group: string }[];
  companions: string;
  destination: string;
  destinationSearch: string;
  foodPreferences: string[];
  foodRestrictions?: string;
  friends?: { friend: number }[];
  pace: string;
  perfectDay?: string;
  placesAvoidToSee?: string;
  placesToSee?: string;
  planningStyle: string;
  season: string;
  tripDurationDays: string;
  tripSuccessDefinition?: string;
  tripVibe: string;
};

export type TravelItineraryRow = {
  created_at: string;
  trip_plan_details: TripPlan;
  form: TravelItineraryForm;
  id: string;
  status: 'in_progress' | 'completed' | string;
  updated_at: string;
  user_id: string;
};

export type SupabaseUpdatePayload = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: TravelItineraryRow;
  old: Partial<TravelItineraryRow>;
  errors: Record<string, unknown>;
};
