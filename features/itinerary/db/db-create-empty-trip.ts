import { requireUser } from '@features/auth/utils/require-user';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';

import { SuggestionFormFields } from '../types/form';

export async function createEmptyTripRecord(formFields: SuggestionFormFields) {
  const { supabase, user } = await requireUser();

  const { data: tripRow, error } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .insert({
      trip_status: 'core_generating',
      user_id: user.id,
      form: formFields,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return tripRow as TravelItineraryRow;
}
