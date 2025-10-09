'use client';

import { ComponentProps, useEffect, useState } from 'react';

import Link from 'next/link';

import { useSupabaseSubscriptionContext } from '@providers/supabase-subscriptions/supabase-subscriptions-context';

import { ProgressModal } from '@components/progress-modal';

export function SupabaseMessageFactory() {
  const { subscriberStatus, currentDay, slug } = useSupabaseSubscriptionContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Automatically open/close modal based on subscription status
  useEffect(() => {
    setIsDialogOpen(subscriberStatus !== 'idle');
  }, [subscriberStatus]);

  const dialogData = {
    idle: {
      title: 'Waiting to start',
      description: 'Preparing your adventure...',
      icon: '🕓',
    },
    core_generating: {
      title: 'Starting your journey ✈️',
      description: 'We’re gathering inspiration and travel data to begin crafting your itinerary.',
    },
    core_ready: {
      title: 'Core generated 🌍',
      description: 'We’ve created the base structure for your adventure — now refining daily details.',
    },
    days_generating: {
      title: 'Building your days 📅',
      description: (
        <>
          <p>
            {currentDay
              ? `Currently generating day ${currentDay} of your adventure.`
              : 'Generating your daily itinerary.'}
          </p>

          {currentDay && currentDay >= 1 && slug && (
            <>
              <p className="mt-2">You can already start exploring!</p>
              <Link href={`/${slug}`} className="underline text-primary">
                View itinerary
              </Link>
            </>
          )}
        </>
      ),
    },
    completed: {
      title: 'All done 🎉',
      description: (
        <p>
          Your trip is ready to explore!{' '}
          {slug && (
            <a href={`/${slug}`} className="text-primary underline">
              View itinerary
            </a>
          )}
        </p>
      ),
    },
    error: {
      title: 'Error 😕',
      description: 'Something went wrong while generating your trip. Please try again or adjust your trip details.',
      icon: '⚠️',
    },
  } satisfies Record<typeof subscriberStatus, ComponentProps<typeof ProgressModal>['data']>;

  return <ProgressModal open={isDialogOpen} onOpenChange={setIsDialogOpen} data={dialogData[subscriberStatus]} />;
}
