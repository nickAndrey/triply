'use client';

import { TravelItineraryRow } from '@/app/_types/supabase-update-payload';

import { SubscriberStatus } from '../supabase-subscriptions-context';

export function resolveTripStatus(trip: TravelItineraryRow): SubscriberStatus {
  if (!trip) return 'idle';
  if (trip.status === 'failed') return 'error';

  const details = trip.trip_plan_details;
  const days = details?.days ?? [];
  const duration = parseInt(trip.form?.tripDurationDays || '1');

  // Check if the "core" of the trip is generated (non-empty object)
  const hasCore = details && Object.keys(details).length > 0;

  if (!hasCore) {
    // Nothing generated yet
    return 'core_generating';
  }

  if (days.length === 0) {
    // Core data exists but no days yet → we’re between step 2 and 3
    return 'core_ready';
  }

  if (days.length < duration) {
    // Some days generated, still in progress
    return 'days_generating';
  }

  if (days.length >= duration) {
    // All days done
    return 'completed';
  }

  return 'idle';
}
