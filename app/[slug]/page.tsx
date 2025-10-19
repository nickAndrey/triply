import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TripPlanView } from '@/app/[slug]/_components/trip-plan-view';
import { DB_TABLES } from '@/app/_constants/db-tables';
import { createClient } from '@/utils/supabase/server';

import { TravelItineraryRow } from '../_types/db/travel-itinerary-row';

export const metadata: Metadata = {
  title: 'Triply | Suggestions',
  description: 'Triply — AI-Powered Travel Planner',
};

export default async function TravelSuggestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .select('*')
    .eq('user_id', user?.id)
    .eq('id', slug)
    .single<TravelItineraryRow>();

  if (!data) return notFound();

  return <TripPlanView dbItinerary={data} />;
}
