'use server';

import { aiGenerateCore } from '../ai/ai-generate-core';
import { dbSaveCore } from '../db/db-save-core';
import { dbSaveDays } from '../db/db-save-days';
import { buildTripCorePrompt } from '../prompts/build-trip-core-prompt';
import { SuggestionFormFields } from '../types/form';

export async function startItineraryGeneration(form: SuggestionFormFields, itineraryId: string) {
  try {
    const corePrompt = buildTripCorePrompt(form);
    const newItineraryCore = await aiGenerateCore(corePrompt);

    await dbSaveCore({ tripId: itineraryId, tripCore: newItineraryCore });
    await dbSaveDays({ tripId: itineraryId, form });
  } catch (err) {
    console.error('Trip generation failed:', err);
    throw err;
  }
}
