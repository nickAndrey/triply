'use client';

import { ProgressModal } from '@/app/_components/progress-modal';
import { useSupabaseSubscriptionContext } from '@/app/_providers/supabase-subscriptions-context';
import { useEffect, useState } from 'react';

export function SupabaseMessageFactory() {
  const { subscriberStatus, progressPercent, currentDay, totalDays, slug, setSubscriberStatus } =
    useSupabaseSubscriptionContext();

  const [dialog, setDialog] = useState({
    tripStart: { open: false },
    coreReady: { open: false },
    daysGenerating: { open: false },
    completed: { open: false },
    error: { open: false },
  });

  useEffect(() => {
    setDialog({
      tripStart: { open: subscriberStatus === 'core_generating' },
      coreReady: { open: subscriberStatus === 'core_ready' },
      daysGenerating: { open: subscriberStatus === 'days_generating' },
      completed: { open: subscriberStatus === 'completed' },
      error: { open: subscriberStatus === 'error' },
    });
  }, [subscriberStatus]);

  switch (subscriberStatus) {
    case 'idle':
      return null;
    case 'core_generating':
      return (
        <ProgressModal
          open={dialog.tripStart.open}
          onOpenChange={(isOpen) => setDialog((prev) => ({ ...prev, tripStart: { open: isOpen } }))}
          data={{
            icon: <span>🌍</span>,
            title: 'We’re crafting your adventure!',
            description: (
              <>
                We’re building your itinerary core. This usually takes about <strong>40 seconds</strong> for setup. Sit
                tight — your personal travel map is on its way.
              </>
            ),
          }}
          progress={30}
        />
      );

    case 'core_ready':
      return (
        <ProgressModal
          open={dialog.coreReady?.open ?? true}
          onOpenChange={(isOpen) => setDialog((prev) => ({ ...prev, coreReady: { open: isOpen } }))}
          data={{
            icon: <span>🎉</span>,
            title: 'Core Ready — Your Trip Page is Live!',
            description: (
              <>
                We’ve set up your itinerary’s foundation. You can now visit your trip page — the first day will appear
                soon!
                {slug && (
                  <div className="mt-3">
                    <a
                      href={`/${slug}`}
                      className="inline-flex items-center gap-1 text-primary underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🌍 View Your Trip
                    </a>
                  </div>
                )}
              </>
            ),
          }}
          progress={50}
        />
      );

    case 'days_generating':
      return (
        <ProgressModal
          open={dialog.daysGenerating.open}
          onOpenChange={(isOpen) => setDialog((prev) => ({ ...prev, daysGenerating: { open: isOpen } }))}
          data={{
            icon: <span>✈️</span>,
            title: 'Building Your Daily Plan...',
            description: (
              <>
                We’re crafting day {currentDay} of {totalDays}. This will complete soon — feel free to explore your trip
                page while we finish up.
              </>
            ),
          }}
          progress={progressPercent ?? 50}
        />
      );

    case 'completed':
      return (
        <ProgressModal
          open={dialog.completed.open}
          onOpenChange={(isOpen) => {
            setDialog((prev) => ({ ...prev, completed: { open: isOpen } }));
            setSubscriberStatus('idle');
          }}
          data={{
            icon: <span>🎉</span>,
            title: 'Your Itinerary is Ready!',
            description: (
              <>
                Your full travel plan is complete! Head over to your trip page to explore all days and start
                customizing.
              </>
            ),
          }}
          progress={100}
        />
      );

    case 'error':
      return (
        <ProgressModal
          open={dialog.error.open}
          onOpenChange={(isOpen) => setDialog((prev) => ({ ...prev, error: { open: isOpen } }))}
          data={{
            icon: <span>⚠️</span>,
            title: 'Something Went Wrong',
            description: (
              <>
                We hit a snag while generating your itinerary. Please try again, or contact support if the issue
                persists.
              </>
            ),
          }}
        />
      );

    default:
      return null;
  }
}
