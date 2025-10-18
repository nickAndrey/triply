'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';
import { createClient } from '@/utils/supabase/server';

export async function deleteItinerary(tripId: string, currentLocationPath?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let itineraryCopy: TravelItineraryRow | null = null;

  if (currentLocationPath) {
    const { data, error } = await supabase
      .from(DB_TABLES.travel_itineraries)
      .select('*')
      .eq('user_id', user?.id)
      .eq('id', tripId)
      .single();

    if (error || !data) {
      throw new Error(`Failed to find itinerary: ${error?.message ?? 'Not found'}`);
    }

    itineraryCopy = data;
  }

  const { error: deletionError } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .delete()
    .eq('user_id', user?.id)
    .eq('id', tripId);

  if (deletionError) {
    throw new Error(`Failed to delete trip: ${deletionError.message}`);
  }

  if (itineraryCopy && itineraryCopy.trip_core.slug === currentLocationPath) {
    redirect('/');
  }

  revalidatePath('/', 'layout');

  return { success: true };
}
