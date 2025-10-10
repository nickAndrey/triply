'use server';

import { Day } from '@/app/_types/trip/trip-day';

import { SuggestionFormFields } from '../types/form';

export function prepareDayPromptContext(days: Day[]): SuggestionFormFields['context'] {
  if (days.length === 0) return;

  const visitedPlaces: string[] = [];
  const themesUsed: string[] = [];
  const previousDaySummaries: string[] = [];

  for (const day of days) {
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
