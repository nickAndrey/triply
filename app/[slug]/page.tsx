import { TripPlanView } from '@/app/[slug]/_components/trip-plan-view';
import { DB_TABLES } from '@/app/_constants/db-tables';
import { TravelItineraryRow } from '@/app/_types/supabase-update-payload';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

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

  if (!user) return redirect('/login');

  const { data } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .select('*')
    .eq('user_id', user.id)
    .filter('trip_plan_details->>slug', 'eq', slug)
    .maybeSingle<TravelItineraryRow>();

  if (!data) return notFound();

  return <TripPlanView dbRow={data} />;
}
