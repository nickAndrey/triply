import { SuggestionSkeleton } from '@/app/(home)/_components/suggestions-carousel/suggestion-skeleton';
import { SuggestionsCarousel } from '@/app/(home)/_components/suggestions-carousel/suggestions-carousel';
import { TripPlanWizardForm } from '@/app/(home)/_components/trip-plan-wizard-form';
import { SupabaseMessageFactory } from '@/app/_components/supabase-message-factory';

import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Triply | Home',
  description: 'Triply — AI-Powered Travel Planner',
};

export default function HomePage() {
  return (
    <main className="flex flex-col gap-6 min-h-[100dvh] max-w-6xl m-auto px-4 py-5">
      <Suspense fallback={<SuggestionSkeleton />}>
        <SuggestionsCarousel />
      </Suspense>
      <TripPlanWizardForm />
      <SupabaseMessageFactory />
    </main>
  );
}
