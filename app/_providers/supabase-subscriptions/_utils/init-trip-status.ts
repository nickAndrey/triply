'use client';

import { resolveTripStatus } from '@providers/supabase-subscriptions/_utils/status-resolver';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { TravelItineraryRow } from '@/app/_types/supabase-update-payload';
import { createClient } from '@/utils/supabase/client';

export async function initTripStatus() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: trip } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .select('*')
    .eq('status', 'in_progress')
    .eq('user_id', user.id)
    .maybeSingle<TravelItineraryRow>();

  if (!trip) return null;

  const status = resolveTripStatus(trip);

  return { trip, status };
}
