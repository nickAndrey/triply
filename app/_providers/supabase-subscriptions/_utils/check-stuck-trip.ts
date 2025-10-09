'use client';

import axios from 'axios';
import { differenceInSeconds } from 'date-fns';

import { TravelItineraryRow } from '@/app/_types/supabase-update-payload';

export async function checkAndResumeStuckTrip(trip: TravelItineraryRow) {
  const diff = differenceInSeconds(new Date(), new Date(trip.updated_at));

  if (trip.status === 'in_progress' && diff > 60) {
    console.warn(`[trip:${trip.id}] Resuming stuck trip (${diff}s old)`);
    await axios.post('/api/suggestion/resume', { tripId: trip.id });
  }
}
