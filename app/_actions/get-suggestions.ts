'use server';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { Suggestion } from '@/app/_types/suggestion';
import { createClient } from '@/utils/supabase/server';
import axios, { AxiosError } from 'axios';
import { createCountrySuggestionPrompt } from './prompts/create-country-suggestion-prompt';

async function generateTravelSuggestions() {
  const DEEPSEEK_API_KEY = process.env.NEXT_DEEPSEEK_API_KEY;
  const API_URL = 'https://api.deepseek.com/chat/completions';

  const prompt = createCountrySuggestionPrompt({
    countries: [
      'France',
      'Spain',
      'United States',
      'Turkey',
      'Italy',
      'Mexico',
      'Germany',
      'Japan',
      'Greece',
      'Thailand',
    ],
  });

  const requestData = {
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  };

  const config = {
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(API_URL, requestData, config);

    // The API returns a string inside `message.content`, we need to parse it as JSON
    const generatedText = response.data.choices[0].message.content;
    const suggestionsArray = JSON.parse(generatedText);

    return suggestionsArray;
  } catch (error) {
    console.error('Error:', (error as AxiosError).response?.data || (error as Error).message);
    throw new Error('Failed to generate travel suggestions');
  }
}

async function setSuggestionsImages(
  rowSuggestions: {
    country: string;
    city: string;
    title: string;
    description: string;
  }[]
): Promise<Suggestion[]> {
  return await Promise.all(
    rowSuggestions.map(async (item) => {
      const searchParams = new URLSearchParams({
        per_page: '1',
        page: '1',
        query: item.city,
        client_id: process.env.NEXT_UNSPLASH_ACCESS_KEY!,
        orientation: 'landscape',
      });

      const { data } = await axios.get(`https://api.unsplash.com/search/photos?${searchParams.toString()}`);

      const photo = data.results?.[0];

      if (!photo) {
        throw new Error(`No Unsplash images found for ${item.city}`);
      }

      const transformedPhoto: Suggestion['photos'][0] = {
        id: photo.id,
        images: photo.urls,
        unsplash_url: photo.links.html,
        photographer_name: photo.user.name,
        photographer_url: photo.user.links.html,
        photographer_profile_image: photo.user.profile_image.large,
      };

      return {
        id: crypto.randomUUID(),
        country: item.country,
        city: item.city,
        title: item.title,
        description: item.description,
        photos: [transformedPhoto],
      };
    })
  );
}

async function storeSuggestionsInDatabase(suggestions: Suggestion[]) {
  try {
    const supabase = await createClient();
    await supabase.from(DB_TABLES.suggestions).insert(suggestions);
  } catch (error) {
    console.error('Error storing suggestions:', error);
  }
}

const GENERATION_CACHE = new Map<string, boolean>();

export async function getSuggestions(): Promise<Suggestion[]> {
  const supabase = await createClient();

  const { count, error: countError } = await supabase
    .from(DB_TABLES.suggestions)
    .select('*', { count: 'exact', head: true });

  const noRecords = !countError && (!count || count === 0);
  const noCache = !GENERATION_CACHE.get('suggestions');

  if (noRecords && noCache) {
    GENERATION_CACHE.set('suggestions', true);

    try {
      const response = await generateTravelSuggestions();
      const preparedSuggestions = await setSuggestionsImages(response.suggestions);
      await storeSuggestionsInDatabase(preparedSuggestions);
    } finally {
      GENERATION_CACHE.delete('suggestions');
    }
  }

  const { data, error: getSuggestionsError } = await supabase.from(DB_TABLES.suggestions).select('*');
  if (getSuggestionsError) throw getSuggestionsError;

  const randomItems = data.sort(() => Math.random() - 0.5).slice(0, 5);
  return randomItems ?? [];
}
