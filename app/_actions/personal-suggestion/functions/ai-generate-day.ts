import axios, { AxiosError } from 'axios';

import { Day } from '@/app/_types/trip/trip-day';
import { safeJsonParse } from '@/app/_utils/safe-json-parse';

import { buildTripDayPrompt } from '../prompts/trip-day-prompt_v1';
import { SuggestionFormFields } from '../types/form';

export async function aiGenerateDay(form: SuggestionFormFields) {
  const DEEPSEEK_API_KEY = process.env.NEXT_DEEPSEEK_API_KEY;
  const API_URL = 'https://api.deepseek.com/chat/completions';

  // const promptParams = {
  //   ...form,
  //   currentDay: this.currentDay,
  //   context: prepareDayPromptContext(),
  // };

  const prompt = buildTripDayPrompt(form);

  const requestData = {
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  };

  try {
    const response = await axios.post(API_URL, requestData, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const raw = response.data.choices[0].message.content as string;
    const parsed = safeJsonParse<Day>(raw);

    if (!parsed) {
      throw new Error(`Invalid itinerary format:\n${raw}`);
    }

    return parsed;
  } catch (error) {
    const errorData = error as AxiosError;

    if (errorData.response && errorData.response.status === 400) {
      throw new Error(`Bad Request: 'Invalid data provided.'`);
    } else if (errorData.response && errorData.response.status === 401) {
      throw new Error('Unauthorized: Please log in again.');
    } else {
      throw new Error(`An unexpected error occurred while posting data.\n\n${error}`);
    }
  }
}
