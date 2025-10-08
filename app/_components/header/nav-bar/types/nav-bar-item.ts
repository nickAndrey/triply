import { TravelItineraryRow } from '@/app/_types/supabase-update-payload';

export type NavBarItem = Pick<TravelItineraryRow, 'id' | 'trip_plan_details'>;
