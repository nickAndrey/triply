import { DB_TABLES } from '@/app/_constants/db-tables';
import { createClient } from '@/utils/supabase/server';

import { aiGenerateDay } from '../ai/ai-generate-day';
import { buildTripDayPrompt } from '../prompts/build-trip-day-prompt';
import { SuggestionFormFields } from '../types/form';
import { prepareDayPromptContext } from '../utils/prepare-day-prompt-context';

type Args = {
  tripId: string;
  form: SuggestionFormFields;
  startFromDay?: number;
};

export async function dbSaveDays({ tripId, form, startFromDay }: Args) {
  const supabase = await createClient();

  const totalDays = Number(form.tripDurationDays);

  try {
    const { data: trip, error: fetchError } = await supabase
      .from(DB_TABLES.travel_itineraries)
      .select('trip_days')
      .eq('id', tripId)
      .single();

    if (fetchError) throw new Error(`DB fetch error: ${fetchError.message}`);

    const updatedDays = [...(trip?.trip_days ?? [])];

    const nextUnfilledDay = updatedDays.length + 1;

    let currentDay = startFromDay ? Math.max(startFromDay, nextUnfilledDay) : nextUnfilledDay;

    while (currentDay <= totalDays) {
      const dayPrompt = buildTripDayPrompt({
        ...form,
        currentDay,
        context: prepareDayPromptContext(updatedDays),
      });

      const newItineraryDay = await aiGenerateDay(dayPrompt);
      updatedDays.push(newItineraryDay);

      const isLastDay = currentDay === totalDays;

      const { error: updateError } = await supabase
        .from(DB_TABLES.travel_itineraries)
        .update({
          trip_days: updatedDays,
          trip_status: isLastDay ? 'completed' : 'days_generating',
          updated_at: new Date().toISOString(),
        })
        .eq('id', tripId);

      if (updateError) throw new Error(`DB update error: ${updateError.message}`);

      console.log(`Generated day ${currentDay} / ${totalDays}`);
      currentDay++;
    }
  } catch (error) {
    console.error(`Day generation failed for trip ${tripId}:`, error);

    await supabase
      .from(DB_TABLES.travel_itineraries)
      .update({
        trip_status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tripId);

    throw error;
  }
}
