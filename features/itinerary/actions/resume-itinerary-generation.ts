'use server';

import axios from 'axios';

import { SuggestionFormFields } from '../types/form';

export async function resumeItineraryGeneration(form: SuggestionFormFields) {
  await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/suggestion/resume`,
    { form },
    { headers: { 'Content-Type': 'application/json' } }
  );
}
