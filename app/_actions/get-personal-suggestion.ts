'use server';

import { createClient } from '@/utils/supabase/server';
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { createTravelPlanPrompt } from './prompts/create-travel-plan-prompt';

async function savePersonalSuggestion(suggestion: string) {
  const supabase = await createClient();
  const parsedSuggestion = JSON.parse(suggestion);

  const { data: userData } = await supabase.auth.getUser();

  const { data: existedSuggestions } = await supabase
    .from('personal_travel_suggestions')
    .select('destination,travel_dates')
    .match({
      destination: parsedSuggestion.metadata.destination,
      travel_dates: `[${parsedSuggestion.metadata.travelDates[0]},${parsedSuggestion.metadata.travelDates[1]}]`,
    })
    .eq('user_id', userData.user.id);

  if (!existedSuggestions) {
    const { error } = await supabase.from('personal_travel_suggestions').insert([
      {
        markdown_content: parsedSuggestion.markdownContent,
        destination: parsedSuggestion.metadata.destination,
        travel_dates: parsedSuggestion.metadata.travelDates,
        trip_duration: parsedSuggestion.metadata.tripDuration,
        budget: parsedSuggestion.metadata.budget,
        preferences: parsedSuggestion.metadata.preferences,
        article_title: parsedSuggestion.metadata.articleTitle,
        detail_note: parsedSuggestion.metadata.detailNote,
        slug: parsedSuggestion.metadata.slug,
        user_id: userData.user.id,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
  }
}

async function generatePersonalSuggestion(prompt: string) {
  const DEEPSEEK_API_KEY = process.env.NEXT_DEEPSEEK_API_KEY;
  const API_URL = 'https://api.deepseek.com/chat/completions';

  const requestData = {
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  };

  const config = {
    headers: {
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(API_URL, requestData, config);
    await savePersonalSuggestion(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw new Error('Failed to generate travel suggestions');
  }
}

export async function getPersonalSuggestion(
  formData: FormData,
  payload: {
    destination: string;
    dateFrom: Date;
    dateTo: Date;
    budget: string;
    preferences: string[];
  }
): Promise<FormData> {
  const prompt = createTravelPlanPrompt({
    destination: payload.destination,
    travelDates: [payload.dateFrom.toISOString(), payload.dateTo.toISOString()],
    budget: payload.budget,
    preferences: payload.preferences,
  });

  await generatePersonalSuggestion(prompt);

  return formData;
}
