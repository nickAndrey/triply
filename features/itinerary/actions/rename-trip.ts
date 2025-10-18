'use server';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { createClient } from '@/utils/supabase/server';

export async function renameTrip(tripId: string, newValue: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.rpc('update_json_field', {
    _table_name: DB_TABLES.travel_itineraries,
    _id: tripId,
    _user_id: user?.id,
    _json_field: 'trip_core',
    _path: ['navTitle'],
    _new_value: newValue,
  });

  if (error) throw new Error(`Failed to rename trip: ${error.message}`);
}
