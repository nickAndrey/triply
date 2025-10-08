'use server';

import { ensureAuth } from '@/app/_actions/utils/ensure-auth';
import { DB_TABLES } from '@/app/_constants/db-tables';
import { createClient } from '@/utils/supabase/server';

export async function renameTrip(tripId: string, newValue: string) {
  const supabase = await createClient();
  const user = await ensureAuth();

  const { error } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .update({ trip_plan_details: { navTitle: newValue } })
    .eq('user_id', user.id)
    .eq('id', tripId);

  if (error) throw new Error(`Failed to rename trip: ${error.message}`);
}
