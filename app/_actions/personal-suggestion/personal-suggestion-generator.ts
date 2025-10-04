import { buildTripCorePrompt } from '@/app/_actions/personal-suggestion/_prompts/trip-core-prompt_v1';
import { buildTripDayPrompt } from '@/app/_actions/personal-suggestion/_prompts/trip-day-prompt_v1';
import { SuggestionFormFields } from '@/app/_actions/personal-suggestion/_types/form';
import { DB_TABLES } from '@/app/_constants/db-tables';
import { Day, TripPlan } from '@/app/_types/trip-plan';
import { safeJsonParse } from '@/app/_utils/safe-json-parse';
import { createClient } from '@/utils/supabase/server';
import axios, { AxiosError } from 'axios';

export class ProgressiveItineraryGenerator {
  private DEEPSEEK_API_KEY = process.env.NEXT_DEEPSEEK_API_KEY;
  private API_URL = 'https://api.deepseek.com/chat/completions';
  private currentDay = 1;
  private supabase;
  private chunks: Day[] = [];

  private TRIP_PLAN: TripPlan | null = null;

  constructor(supabase: ReturnType<typeof createClient>) {
    this.supabase = supabase;
  }

  private buildPromptContext(): SuggestionFormFields['context'] {
    const visitedPlaces: string[] = [];
    const themesUsed: string[] = [];
    const previousDaySummaries: string[] = [];

    if (!this.TRIP_PLAN) return undefined;

    for (const day of this.TRIP_PLAN.days) {
      visitedPlaces.push(
        ...day.morning.map((m) => m.name),
        ...day.afternoon.map((a) => a.name),
        ...day.evening.map((e) => e.name)
      );
      themesUsed.push(day.theme);
      previousDaySummaries.push(day.summary);
    }

    return { visitedPlaces, themesUsed, previousDaySummaries };
  }

  private async generateSingleDaySuggestion(form: SuggestionFormFields) {
    const promptParams = {
      ...form,
      currentDay: this.currentDay,
      context: this.buildPromptContext(),
    };

    const prompt = buildTripDayPrompt(promptParams);

    const requestData = {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    };

    try {
      const response = await axios.post(this.API_URL, requestData, {
        headers: {
          'Authorization': `Bearer ${this.DEEPSEEK_API_KEY}`,
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
      console.error('Generation error:', (error as AxiosError).response?.data || (error as Error).message);
      throw error;
    }
  }

  private async generateSuggestionCore(form: SuggestionFormFields) {
    const prompt = buildTripCorePrompt(form);

    const requestData = {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    };

    try {
      const response = await axios.post(this.API_URL, requestData, {
        headers: {
          'Authorization': `Bearer ${this.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const raw = response.data.choices[0].message.content as string;
      const parsed = safeJsonParse<TripPlan>(raw);

      if (!parsed) {
        throw new Error(`Invalid itinerary format:\n${raw}`);
      }

      return parsed;
    } catch (error) {
      console.error('Generation error:', (error as AxiosError).response?.data || (error as Error).message);
      throw error;
    }
  }

  private async startGenerateDayByDayTripPlan(tripId: string, form: SuggestionFormFields) {
    const db = await this.supabase;

    const totalDays = Number(form.tripDurationDays);

    while (this.currentDay <= totalDays) {
      const daySuggestion = await this.generateSingleDaySuggestion(form);

      if (daySuggestion) {
        await db.rpc('append_day_to_itinerary', {
          trip_id: tripId,
          new_day: daySuggestion,
        });

        this.TRIP_PLAN?.days.push(daySuggestion);
        this.currentDay++;
      } else {
        console.error(`Failed to parse suggestion for day ${this.currentDay}`);
        break;
      }
    }

    await db.from(DB_TABLES.travel_itineraries).update({ status: 'completed' }).eq('id', tripId);
  }

  async startGenerateTripPlan(tripId: string) {
    const db = await this.supabase;

    const { data: trip } = await db.from(DB_TABLES.travel_itineraries).select().eq('id', tripId).single();

    const form = trip.form as SuggestionFormFields;
    const generatedSuggestionCore = await this.generateSuggestionCore(form);

    this.TRIP_PLAN = generatedSuggestionCore;

    const { error } = await db
      .from(DB_TABLES.travel_itineraries)
      .update({ trip_plan_details: generatedSuggestionCore })
      .eq('id', tripId);

    if (error) throw new Error(error.message);

    await this.startGenerateDayByDayTripPlan(tripId, form);
  }

  async resumeGenerateDayByDayTripPlan(tripId: string) {
    const db = await this.supabase;

    const { data: trip, error } = await db.from(DB_TABLES.travel_itineraries).select().eq('id', tripId).single();

    if (error || !trip) throw new Error('Trip not found');

    const form = trip.form as SuggestionFormFields;
    const totalDays = Number(form.tripDurationDays);

    this.currentDay = (trip.days?.length || 0) + 1;
    this.TRIP_PLAN = trip;

    while (this.currentDay <= totalDays) {
      const daySuggestion = await this.generateSingleDaySuggestion(form);

      if (daySuggestion) {
        await db.rpc('append_day_to_itinerary', {
          trip_id: tripId,
          new_day: daySuggestion,
        });

        this.TRIP_PLAN?.days.push(daySuggestion);
        this.currentDay++;
      } else {
        console.error(`Failed to parse suggestion for day ${this.currentDay}`);
        break;
      }
    }

    await db.from(DB_TABLES.travel_itineraries).update({ status: 'completed' }).eq('id', tripId);
  }
}
