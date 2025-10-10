'use server';

import { aiGenerateCore } from '../ai/ai-generate-core';
import { createEmptyTripRecord } from '../db/db-create-empty-trip';
import { dbSaveCore } from '../db/db-save-core';
import { dbSaveDays } from '../db/db-save-days';
import { buildTripCorePrompt } from '../prompts/build-trip-core-prompt';
import { SuggestionFormFields } from '../types/form';

export async function startItineraryGeneration(form: SuggestionFormFields) {
  try {
    const { id } = await createEmptyTripRecord(form);

    const corePrompt = buildTripCorePrompt(form);
    const newItineraryCore = await aiGenerateCore(corePrompt);

    await dbSaveCore({ tripId: id, tripCore: newItineraryCore });
    await dbSaveDays({ tripId: id, form });
  } catch (err) {
    console.error('Trip generation failed:', err);
    throw err;
  }
}
