import { getSingleDayPrompt } from '@/app/_actions/personal-suggestion/_prompts/get-single-day-prompt';
import { SuggestionFormFields } from '@/app/_actions/personal-suggestion/_types/form';
import { DB_TABLES } from '@/app/_constants/db-tables';
import { TravelItineraryDay } from '@/app/_types/supabase-update-payload';
import { createClient } from '@/utils/supabase/server';
import axios, { AxiosError } from 'axios';

export class ProgressiveItineraryGenerator {
  private DEEPSEEK_API_KEY = process.env.NEXT_DEEPSEEK_API_KEY;
  private API_URL = 'https://api.deepseek.com/chat/completions';
  private currentDay = 1;
  private supabase;
  private chunks: Record<string, unknown>[] = [];

  constructor(supabase: ReturnType<typeof createClient>) {
    this.supabase = supabase;
  }

  private async generateSingleDaySuggestion(form: SuggestionFormFields) {
    let promptContext: SuggestionFormFields['context'] | undefined;

    if (this.chunks.length > 0) {
      promptContext = {
        visitedPlaces: [],
        themesUsed: [],
        previousDaySummaries: [],
      };

      this.chunks.forEach((item) => {
        const metadata = item.metadata as TravelItineraryDay['metadata'];
        if (!metadata) return;

        if (metadata.visitedPlaces) {
          promptContext?.visitedPlaces?.push(...metadata.visitedPlaces);
        }

        if (metadata.themesUsed) {
          promptContext?.themesUsed?.push(...metadata.themesUsed);
        }

        if (metadata.daySummary) {
          promptContext?.previousDaySummaries?.push(metadata.daySummary);
        }
      });
    }

    const promptParams = {
      ...form,
      currentDay: this.currentDay,
      context: promptContext,
    };

    const prompt = getSingleDayPrompt(promptParams);

    const requestData = {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${this.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(this.API_URL, requestData, config);
      const respContent = response.data.choices[0].message.content as string;
      return respContent;
    } catch (error) {
      console.error('Error:', (error as AxiosError).response?.data || (error as Error).message);
      throw new Error(`Failed to generate travel suggestions\nDetails:\n${error}`);
    }
  }

  async runForTrip(tripId: string) {
    const db = await this.supabase;

    const { data: trip } = await db.from(DB_TABLES.travel_itineraries).select().eq('id', tripId).single();

    const form = trip.form as SuggestionFormFields;
    const totalDays = Number(form.tripDurationDays);

    while (this.currentDay <= totalDays) {
      const generatedSuggestion = await this.generateSingleDaySuggestion(form);
      const parsedSuggestion = JSON.parse(generatedSuggestion);

      await db.rpc('append_day_to_itinerary', {
        trip_id: trip.id,
        new_day: parsedSuggestion,
      });

      this.chunks.push(parsedSuggestion);
      this.currentDay++;
    }

    await db.from(DB_TABLES.travel_itineraries).update({ status: 'completed' }).eq('id', tripId);
  }

  async resumeTrip(tripId: string) {
    const db = await this.supabase;

    const { data: trip, error } = await db.from(DB_TABLES.travel_itineraries).select().eq('id', tripId).single();

    if (error || !trip) throw new Error('Trip not found');

    const form = trip.form as SuggestionFormFields;
    const totalDays = Number(form.tripDurationDays);

    this.currentDay = (trip.days?.length || 0) + 1;
    this.chunks = trip.days || [];

    while (this.currentDay <= totalDays) {
      const generatedSuggestion = await this.generateSingleDaySuggestion(form);
      const parsedSuggestion = JSON.parse(generatedSuggestion);

      await db.rpc('append_day_to_itinerary', {
        trip_id: trip.id,
        new_day: parsedSuggestion,
      });

      this.chunks.push(parsedSuggestion);
      this.currentDay++;
    }

    await db.from(DB_TABLES.travel_itineraries).update({ status: 'completed' }).eq('id', tripId);
  }
}
