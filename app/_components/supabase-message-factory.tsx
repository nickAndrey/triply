'use client';

import { ComponentProps, useEffect, useState } from 'react';

import Link from 'next/link';

import { useItineraryGenerationSubscriber } from '@providers/itinerary-generation-subscriber-context';

import { ProgressModal } from '@components/progress-modal';

import { TravelItineraryRow } from '../_types/db/travel-itinerary-row';

export function SupabaseMessageFactory() {
  const { itinerary } = useItineraryGenerationSubscriber();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [slug, setSlug] = useState('');
  const [currentDay, setCurrentDay] = useState(0);
  const [status, setStatus] = useState<TravelItineraryRow['trip_status'] | 'pending'>('pending');

  // Automatically open/close modal based on subscription status
  useEffect(() => {
    if (!itinerary) return;

    const { trip_status, trip_core, trip_days } = itinerary;

    if (trip_status === 'completed' || trip_status === 'failed') {
      setIsDialogOpen(false);
    } else {
      setIsDialogOpen(true);
    }

    setStatus(trip_status);
    setSlug(trip_core.slug);
    setCurrentDay((trip_days?.length || 0) + 1);
  }, [itinerary]);

  const dialogData = {
    pending: {
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
            {currentDay && currentDay > 1
              ? `Currently generating day ${currentDay} of your ${itinerary?.trip_core.tripDurationDays}-day trip.`
              : 'Generating your daily itinerary...'}
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
    failed: {
      title: 'Error 😕',
      description: 'Something went wrong while generating your trip. Please try again or adjust your trip details.',
      icon: '⚠️',
    },
  } satisfies Record<typeof status, ComponentProps<typeof ProgressModal>['data']>;

  return <ProgressModal open={isDialogOpen} onOpenChange={setIsDialogOpen} data={dialogData[status]} />;
}
