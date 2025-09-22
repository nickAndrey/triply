'use server';

import { generateCountryFacts } from '@/app/_actions/prompts/generate-country-facts';
import axios, { AxiosError } from 'axios';

export async function getCountryFacts() {
  const DEEPSEEK_API_KEY = process.env.NEXT_DEEPSEEK_API_KEY;
  const API_URL = 'https://api.deepseek.com/chat/completions';

  const prompt = generateCountryFacts();

  const requestData = {
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
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
    console.error(
      'Error:',
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error('Failed to generate travel suggestions');
  }
}
