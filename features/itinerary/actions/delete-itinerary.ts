'use server';

import { revalidatePath } from 'next/cache';

import { requireUser } from '@features/auth/utils/require-user';

import { DB_TABLES } from '@/app/_constants/db-tables';

export async function deleteItinerary(tripId: string) {
  const { supabase, user } = await requireUser();

  const { error: deletionError } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .delete()
    .eq('user_id', user.id)
    .eq('id', tripId);

  if (deletionError) throw new Error(`Failed to delete trip: ${deletionError.message}`);

  revalidatePath('/', 'layout');
}
