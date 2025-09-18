'use server';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { createClient } from '@/utils/supabase/server';
import axios, { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { createTravelPlanPrompt } from './prompts/create-travel-plan-prompt';

async function savePersonalSuggestion(suggestion: string) {
  const supabase = await createClient();
  const parsedSuggestion = JSON.parse(suggestion);

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) throw new Error('Unauthorized, user was not found.');

  const { data: existedSuggestions } = await supabase
    .from(DB_TABLES.personal_travel_suggestions)
    .select('destination,travel_dates')
    .match({
      destination: parsedSuggestion.metadata.destination,
      travel_dates: `[${parsedSuggestion.metadata.travelDates[0]},${parsedSuggestion.metadata.travelDates[1]}]`,
    })
    .eq('user_id', userData.user.id);

  if (!existedSuggestions) {
    const { error } = await supabase
      .from(DB_TABLES.personal_travel_suggestions)
      .insert([
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

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      'Error:',
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error('Failed to generate travel suggestions');
  }
}

export async function getPersonalSuggestion(payload: {
  destination: string;
  dateFrom: Date;
  dateTo: Date;
  budget: string;
  preferences: string[];
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) throw new Error('Unauthorized, user was not found.');

  // Insert pending job status (we will use it on the client to sync statuses)
  const { data: job, error: insertError } = await supabase
    .from(DB_TABLES.suggestion_jobs)
    .insert([{ user_id: userData.user.id, status: 'pending' }])
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);

  try {
    // Call DeepSeek
    const prompt = createTravelPlanPrompt({
      destination: payload.destination,
      travelDates: [
        payload.dateFrom.toISOString(),
        payload.dateTo.toISOString(),
      ],
      budget: payload.budget,
      preferences: payload.preferences,
    });

    const response = await generatePersonalSuggestion(prompt);
    // ----

    // Save real suggestion
    await savePersonalSuggestion(response);
    // ----

    // Mark job as success, so client can read success state
    await supabase
      .from(DB_TABLES.suggestion_jobs)
      .update({ status: 'success' })
      .eq('id', job.id);
    // ----

    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err) {
    // Mark job as failed, so client can read error state
    await supabase
      .from(DB_TABLES.suggestion_jobs)
      .update({ status: 'error', error_message: String(err) })
      .eq('id', job.id);

    throw err;
  }
}
