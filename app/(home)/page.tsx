import { PendingSuggestionDialog } from '@/app/(home)/_components/pending-suggestion-dialog';
import { SuggestionForm } from '@/app/(home)/_components/suggestion-form/suggestion-form';
import { SuggestionSkeleton } from '@/app/(home)/_components/suggestions-carousel/suggestion-skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/chadcn/components/ui/card';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Triply | Home',
  description: 'Triply — AI-Powered Travel Planner',
};

export default function HomePage() {
  return (
    <main className="flex flex-col gap-6 min-h-[100dvh] max-w-6xl m-auto px-4 py-5">
      <Suspense fallback={<SuggestionSkeleton />}>{/* <SuggestionsCarousel /> */}</Suspense>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>Plan Your Next Adventure</CardTitle>
          <CardDescription>Tell us what you’re looking for and we’ll suggest trips tailored for you.</CardDescription>
        </CardHeader>

        <CardContent>
          <SuggestionForm />
        </CardContent>
      </Card>

      <PendingSuggestionDialog />
    </main>
  );
}
