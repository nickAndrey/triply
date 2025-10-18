import { DB_TABLES } from '@/app/_constants/db-tables';
import { TripCore } from '@/app/_types/trip/trip-core';
import { createClient } from '@/utils/supabase/server';

type Args = {
  tripId: string;
  tripCore: TripCore;
};

export async function dbSaveCore({ tripId, tripCore }: Args) {
  const supabase = await createClient();

  try {
    const { error: updateError } = await supabase
      .from(DB_TABLES.travel_itineraries)
      .update({
        trip_core: tripCore,
        trip_status: 'core_ready',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tripId);

    if (updateError) throw new Error(`Failed to update trip_core: ${updateError.message}`);
  } catch (error) {
    console.error(`[Trip:${tripId}] Core generation failed:`, error);

    await supabase
      .from(DB_TABLES.travel_itineraries)
      .update({ trip_status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', tripId);

    throw error;
  }
}
