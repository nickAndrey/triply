'use client';

import { ComponentProps, useEffect, useState } from 'react';

import Link from 'next/link';

import { LoaderCircle } from 'lucide-react';

import { useItineraryGenerationSubscriber } from '@providers/itinerary-generation-subscriber-context';
import { useRequest } from '@providers/request-context';

import { Button } from '@chadcn/components/ui/button';

import { ProgressModal } from '@components/progress-modal';

import { TravelItineraryRow } from '../_types/db/travel-itinerary-row';

export function SupabaseMessageFactory() {
  const { itinerary, isProgressDialog, onProgressDialogChange, handleResume } = useItineraryGenerationSubscriber();
  const { isPending } = useRequest();

  const [currentDay, setCurrentDay] = useState(0);
  const [status, setStatus] = useState<TravelItineraryRow['trip_status'] | 'pending'>('pending');

  // Automatically open/close modal based on subscription status
  useEffect(() => {
    if (!itinerary) return;

    const { trip_status, trip_days } = itinerary;

    if (!isProgressDialog.userDismissed) {
      onProgressDialogChange({ open: true });
    }

    setStatus(trip_status);
    setCurrentDay((trip_days?.length || 0) + 1);
  }, [itinerary, isProgressDialog]);

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

          {currentDay && currentDay >= 1 && itinerary?.id && (
            <>
              <p className="mt-2">You can already start exploring!</p>
              <Link href={`/${itinerary.id}`} className="underline text-primary">
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
          {itinerary?.id && (
            <a href={`/${itinerary.id}`} className="text-primary underline">
              View itinerary
            </a>
          )}
        </p>
      ),
    },
    failed: {
      title: 'Generation interrupted ⚠️',
      description: (
        <>
          <p>
            Your itinerary generation stopped{' '}
            {itinerary?.trip_days?.length ? `after day ${itinerary.trip_days.length}` : 'before it could start'}.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            You can try to resume where it left off, or cancel this trip and start a new one.
          </p>
        </>
      ),
      footerContent: (
        <>
          <Button variant="secondary">Cancel</Button>
          <Button
            onClick={() => {
              handleResume(itinerary);
            }}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                <span>Resuming...</span>
              </>
            ) : (
              <span>Resume</span>
            )}
          </Button>
        </>
      ),
    },
  } satisfies Record<typeof status, ComponentProps<typeof ProgressModal>['data']>;

  return (
    <ProgressModal
      open={isProgressDialog.open}
      onOpenChange={(isOpen) => onProgressDialogChange({ open: isOpen, userDismissed: true })}
      data={dialogData[status]}
    />
  );
}
