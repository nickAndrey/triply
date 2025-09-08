'use server';

import { Suggestion } from '@/app/_types/suggestion';
import { createClient } from '@/utils/supabase/server';
import axios from 'axios';

async function getIpInfo() {
  const ipInfo = await fetch('https://ipinfo.io/json');

  const info = (await ipInfo.json()) as {
    region: string;
    country: string;
    city: string;
  };

  return info;
}

async function generateTravelSuggestions(country: string) {
  const DEEPSEEK_API_KEY = process.env.NEXT_DEEPSEEK_API_KEY;
  const API_URL = 'https://api.deepseek.com/chat/completions';

  const userPrompt = `
    You are an AI travel planner. Generate **travel suggestion cards** for a given country: ${country}. Each suggestion must include:  

    - **city**: \`"City"\` format (e.g., \`"Rome"\`).  
    - **title**: \`"City, Country"\` format (e.g., \`"Rome, Italy"\`).  
    - **description**: A short, engaging one-liner (max 2 sentences) that captures the essence of the destination — vibe, highlights, or unique appeal.

    ### Requirements
    1. The length of results must be 5.
    2. Suggestions should be **diverse**: mix cultural hubs, nature escapes, and popular icons.  
    3. Focus on **internationally recognizable cities/regions** rather than small towns.  
    4. Tone should be **inspiring but concise**, like a travel magazine teaser.  
    5. Return results in JSON array format.  

    ### Example  
    [{
      "city": "Rome",
      "title": "Rome, Italy",
      "description": "Step into the Eternal City — explore ancient ruins, vibrant piazzas, and world-famous cuisine. From the Colosseum to hidden trattorias, Rome is where history and modern life meet."
    }]
  `;

  const requestData = {
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.8,
    max_tokens: 500,
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

    // The API returns a string inside `message.content`, we need to parse it as JSON
    const generatedText = response.data.choices[0].message.content;
    const suggestionsArray = JSON.parse(generatedText);

    return suggestionsArray;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw new Error('Failed to generate travel suggestions');
  }
}

async function setSuggestionsImages(
  rowSuggestions: {
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

      const searchRes = await fetch(
        `https://api.unsplash.com/search/photos?${searchParams.toString()}`
      );

      const searchJson = await searchRes.json();
      const photo = searchJson.results?.[0];

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
        title: item.title,
        description: item.description,
        photos: [transformedPhoto],
      };
    })
  );
}

export async function getSuggestions(): Promise<Suggestion[]> {
  const supabase = await createClient();

  // 1. Detect user location (IP → country/region).
  // 2. Query DB for cached suggestions for that region/country.
  // 3. If none → trigger AI to generate new suggestions.
  // 4. For each suggestion → fetch Unsplash image + attribution → insert into DB.
  // 5. Return cached/new suggestions.

  const ipInfo = await getIpInfo();

  const { data: dbSuggestions } = await supabase
    .from('suggestions')
    .select('*')
    .ilike('country', ipInfo.country);

  if (dbSuggestions.length === 0) {
    const { suggestions } = await generateTravelSuggestions(ipInfo.country);
    const suggestionsWithPhotos = await setSuggestionsImages(suggestions);

    const { error: insertionError } = await supabase.from('suggestions').insert({
      id: crypto.randomUUID(),
      country: ipInfo.country,
      records: suggestionsWithPhotos,
    });

    insertionError
      ? console.error('Error inserting suggestions:', insertionError)
      : console.log('Suggestions saved.');

    return suggestionsWithPhotos;
  }

  return dbSuggestions[0].records;
}
