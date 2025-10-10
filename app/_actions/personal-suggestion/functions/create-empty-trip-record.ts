'use server';

import { redirect } from 'next/navigation';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';
import { createClient } from '@/utils/supabase/server';

import { SuggestionFormFields } from '../types/form';

export async function createEmptyTripRecord(formFields: SuggestionFormFields) {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect('/login');

  const { data: tripRow, error } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .insert({
      trip_status: 'core_generating',
      user_id: authData.user.id,
      form: formFields,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return tripRow as TravelItineraryRow;
}
