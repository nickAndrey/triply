'use server';

import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';

import { dbSaveDays } from '../db/db-save-days';

export async function resumeItineraryGeneration(itinerary: TravelItineraryRow) {
  const { id, form, trip_days, trip_status } = itinerary;

  if (!form) throw new Error('Missing form data on itinerary');
  if (trip_status === 'completed') return;

  const currentDay = (trip_days?.length || 0) + 1;

  console.log(`Resuming itinerary ${id} from day ${currentDay}`);

  await dbSaveDays({ tripId: id, form, startFromDay: currentDay });
}
