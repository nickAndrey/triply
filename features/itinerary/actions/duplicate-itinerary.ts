'use server';

import { revalidatePath } from 'next/cache';

import { requireUser } from '@features/auth/utils/require-user';

import { DB_TABLES } from '@/app/_constants/db-tables';

function makeDuplicateSlug(originalSlug: string): string {
  const baseSlug = originalSlug.replace(/(-copy(-[a-f0-9]+)?)$/i, '');
  const uniqueSuffix = crypto.randomUUID().split('-')[0];
  return `${baseSlug}-copy-${uniqueSuffix}`;
}

export async function duplicateItinerary(tripId: string) {
  const { supabase, user } = await requireUser();

  const { data: itineraryToDuplicate, error } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .select('*')
    .eq('user_id', user.id)
    .eq('id', tripId)
    .single();

  if (error || !itineraryToDuplicate) {
    throw new Error(`Failed to get itinerary: ${error?.message}`);
  }

  const { id, created_at, updated_at, ...rest } = itineraryToDuplicate;

  const newItinerary = {
    ...rest,
    user_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    trip_core: {
      ...itineraryToDuplicate.trip_core,
      navTitle: `${itineraryToDuplicate.trip_core.navTitle} (Copy)`,
      slug: makeDuplicateSlug(itineraryToDuplicate.trip_core.slug),
    },
  };

  const { data: inserted, error: duplicationError } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .insert([newItinerary])
    .select()
    .single();

  if (duplicationError) {
    throw new Error(`Failed to duplicate itinerary: ${duplicationError.message}`);
  }

  revalidatePath('/', 'layout');

  return inserted;
}
