'use server';

import { ensureAuth } from '@/app/_actions/utils/ensure-auth';
import { DB_TABLES } from '@/app/_constants/db-tables';
import { createClient } from '@/utils/supabase/server';

export async function renameTrip(tripId: string, newValue: string) {
  const supabase = await createClient();
  const user = await ensureAuth();

  const { error } = await supabase.rpc('update_json_field', {
    _table_name: DB_TABLES.travel_itineraries,
    _id: tripId,
    _user_id: user.id,
    _json_field: 'trip_plan_details',
    _path: ['navTitle'],
    _new_value: newValue,
  });

  if (error) throw new Error(`Failed to rename trip: ${error.message}`);
}
