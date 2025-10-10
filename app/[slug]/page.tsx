import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireUser } from '@features/auth/utils/require-user';

import { TripPlanView } from '@/app/[slug]/_components/trip-plan-view';
import { DB_TABLES } from '@/app/_constants/db-tables';

import { TravelItineraryRow } from '../_types/db/travel-itinerary-row';

export const metadata: Metadata = {
  title: 'Triply | Suggestions',
  description: 'Triply — AI-Powered Travel Planner',
};

export default async function TravelSuggestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();

  const { data } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .select('*')
    .eq('user_id', user.id)
    .filter('trip_core->>slug', 'eq', slug)
    .single<TravelItineraryRow>();

  if (!data) return notFound();

  return <TripPlanView dbItinerary={data} />;
}
