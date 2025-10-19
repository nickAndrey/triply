'use client';

import { ComponentProps, useEffect, useState } from 'react';

import { LoaderCircle } from 'lucide-react';

import { useItineraryGenerationSubscriber } from '@providers/itinerary-generation-subscriber-context';
import { useRequest } from '@providers/request-context';

import { Button } from '@chadcn/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@chadcn/components/ui/tooltip';

import { ProgressModal } from '@components/progress-modal';

import { TravelItineraryRow } from '../_types/db/travel-itinerary-row';
import { TravelLoader } from './travel-loader';

export function SupabaseStatusDialog() {
  const { itinerary, userDismissed, setUserDismissed, handleResume } = useItineraryGenerationSubscriber();
  const { isPending } = useRequest();

  const [currentDay, setCurrentDay] = useState(0);
  const [status, setStatus] = useState<TravelItineraryRow['trip_status'] | 'pending'>('pending');
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  // Automatically open/close modal based on subscription status
  useEffect(() => {
    if (!itinerary) return;

    const { trip_status, trip_days } = itinerary;

    if (!userDismissed) {
      setIsDialogVisible(true);
    }

    setStatus(trip_status);
    setCurrentDay((trip_days?.length || 0) + 1);
  }, [itinerary, userDismissed]);

  const dialogData: Record<typeof status, ComponentProps<typeof ProgressModal>['data']> = {
    pending: {
      title: 'Preparing your trip',
      description: 'We’re getting everything ready to start building your adventure.',
      icon: '🕓',
    },
    core_generating: {
      title: 'Starting your journey ✈️',
      description: 'Collecting inspiration and data to design your travel core.',
    },
    core_ready: {
      title: 'Trip core ready 🌍',
      description: 'The main structure is set — refining daily details next.',
    },
    days_generating: {
      title: 'Building your days 📅',
      description:
        currentDay && currentDay > 1
          ? `Creating day ${currentDay} of your ${itinerary?.trip_core.tripDurationDays}-day itinerary.`
          : 'Generating your daily schedule...',
      sublink: currentDay >= 1 && itinerary?.id ? { label: 'View itinerary', href: `/${itinerary.id}` } : undefined,
    },
    completed: {
      title: 'All done 🎉',
      description: 'Your trip is ready — have a look!',
      sublink: itinerary?.id ? { label: 'Open itinerary', href: `/${itinerary.id}` } : undefined,
    },
    failed: {
      title: 'Something went wrong ⚠️',
      description: itinerary?.trip_days?.length
        ? `Generation stopped after day ${itinerary.trip_days.length}. You can resume or start over.`
        : 'Generation stopped before it could begin.',
      footerButtons: (
        <>
          <Button variant="secondary">Cancel</Button>
          <Button onClick={() => handleResume(itinerary)} disabled={isPending}>
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
  };

  return (
    <>
      {userDismissed && isPending && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="link"
              className="rounded-full fixed right-6 top-10 z-10 h-9 w-9"
              onClick={() => setUserDismissed(false)}
            >
              <TravelLoader size={45} />
            </Button>
          </TooltipTrigger>

          <TooltipContent className="!max-w-[200px]">
            Your itinerary is being generated. Click to view details.
          </TooltipContent>
        </Tooltip>
      )}

      <ProgressModal
        open={isDialogVisible}
        onOpenChange={(isOpen) => {
          setIsDialogVisible(isOpen);
          if (!isOpen) setUserDismissed(true);
        }}
        data={dialogData[status]}
      />
    </>
  );
}
