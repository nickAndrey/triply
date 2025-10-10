'use server';

import { requireUser } from '@features/auth/utils/require-user';

import { DB_TABLES } from '@/app/_constants/db-tables';

export async function deleteTrip(tripId: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from(DB_TABLES.travel_itineraries).delete().eq('user_id', user.id).eq('id', tripId);

  if (error) throw new Error(`Failed to delete trip: ${error.message}`);
}
