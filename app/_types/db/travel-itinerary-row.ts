import { TravelItineraryForm } from '../form/travel-itinerary-form';
import { TripCore } from '../trip/trip-core';
import { Day } from '../trip/trip-day';

export type TravelItineraryRow = {
  id: string;
  user_id: string;
  trip_core: TripCore;
  trip_days: Day[];
  form: TravelItineraryForm;
  trip_status: 'core_generating' | 'core_ready' | 'days_generating' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
};
