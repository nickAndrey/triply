'use server';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { createClient } from '@/utils/supabase/server';

import { buildTripCorePrompt } from '../prompts/trip-core-prompt_v1';
import { SuggestionFormFields } from '../types/form';
import { aiGenerateCore } from './ai-generate-core';

export async function saveTripCoreData(tripId: string, form: SuggestionFormFields) {
  const db = await createClient();

  const prompt = buildTripCorePrompt(form);

  try {
    const aiCore = await aiGenerateCore(prompt);

    const { error: updateError } = await db
      .from(DB_TABLES.travel_itineraries)
      .update({
        trip_core: aiCore,
        trip_status: 'core_ready',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tripId);

    if (updateError) throw new Error(`Failed to update trip_core: ${updateError.message}`);

    await db.rpc('update_trip_status', { trip_id: tripId });

    return aiCore;
  } catch (error) {
    console.error(`[Trip:${tripId}] Core generation failed:`, error);

    await db
      .from(DB_TABLES.travel_itineraries)
      .update({
        trip_status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tripId);

    throw error;
  }
}
