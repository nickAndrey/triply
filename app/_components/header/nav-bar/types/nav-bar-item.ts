import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';

export type NavBarItem = Pick<TravelItineraryRow, 'id' | 'trip_core' | 'form'>;
