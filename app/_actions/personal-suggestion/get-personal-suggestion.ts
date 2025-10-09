'use server';

import axios from 'axios';

import { SuggestionFormFields } from '@/app/_actions/personal-suggestion/_types/form';
import { DB_TABLES } from '@/app/_constants/db-tables';
import { createClient } from '@/utils/supabase/server';

export async function startItineraryGeneration(form: SuggestionFormFields) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: trip, error } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .insert({
      status: 'in_progress',
      user_id: user.id,
      form,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/suggestion/generate`,
    { tripId: trip.id },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return { tripId: trip.id as string };
}
