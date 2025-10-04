'use client';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { useRequest } from '@/app/_providers/request-context';
import { TravelItineraryRow } from '@/app/_types/supabase-update-payload';
import { Progress } from '@/chadcn/components/ui/progress';
import { createClient } from '@/utils/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import axios from 'axios';
import { differenceInSeconds } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const SupabaseSubscriptionContext = createContext<
  | {
      tripId: string;
      setTripId: (tripId: string) => void;
    }
  | undefined
>(undefined);

export function SupabaseSubscriptionProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const { start, finish } = useRequest();

  const [tripId, setTripId] = useState('');

  useEffect(() => {
    const getActiveGenerationTrip = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: trip } = await supabase
        .from(DB_TABLES.travel_itineraries)
        .select('*')
        .eq('status', 'in_progress')
        .eq('user_id', user.id)
        .maybeSingle();

      if (trip) {
        setTripId(trip.id);
        start();

        const lastUpdated = new Date(trip.updated_at);
        const now = new Date();
        const diffInSeconds = differenceInSeconds(now, lastUpdated);
        const isStuck = trip.status === 'in_progress' && diffInSeconds > 60;

        if (isStuck) {
          console.warn('Trip generation seems stuck, resuming...');
          await axios.post('/api/suggestion/resume', { tripId: trip.id });
        }
      }
    };

    getActiveGenerationTrip();
  }, [supabase, start]);

  useEffect(() => {
    if (!tripId) return;

    const channel = supabase
      .channel(`trip-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: DB_TABLES.travel_itineraries,
          filter: `id=eq.${tripId}`,
        },
        async (payload: RealtimePostgresChangesPayload<TravelItineraryRow>) => {
          if (Object.keys(payload.new).length === 0) return;

          const newPayload = payload.new as TravelItineraryRow;
          const { trip_plan_details } = newPayload;

          const days = trip_plan_details.days ?? [];
          const form = newPayload.form ?? { tripDurationDays: '1' };

          const progress = Math.round((days.length / parseInt(form.tripDurationDays || '1')) * 100);

          const slug = trip_plan_details.slug ?? '';
          const isFirstDay = days.length === 1;

          // Revalidate on the server
          await axios.post('/api/revalidate', { paths: ['/', slug ? `/${slug}` : '/'] });

          // Force refresh current route so UI updates
          router.refresh();

          if (isFirstDay) {
            toast.custom(
              () => (
                <div className="p-6 bg-background border border-border rounded-xl shadow-lg w-96">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-1">✨ Hey, you can start diving in!</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        Your trip planning is underway. While we continue generating the rest of your itinerary, you can
                        already explore the first day and start customizing your adventure.
                      </p>

                      <Progress value={progress} className="mb-4" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{progress}% complete</span>
                        <Link
                          href={`/${slug}`}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                          Start Exploring →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ),
              { duration: 15000 }
            );
          }

          if (progress === 100) {
            toast.custom(
              () => (
                <div className="p-6 bg-background border border-border rounded-xl shadow-lg w-96">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-2">🎉 Your itinerary is ready!</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Your complete travel plan has been generated. Start exploring and make it yours!
                      </p>
                      {
                        <div className="flex justify-end">
                          <Link
                            href={`/${slug}`}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                          >
                            View Full Itinerary →
                          </Link>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              ),
              { duration: 10000 }
            );
            finish();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, tripId, router, finish]);

  return (
    <SupabaseSubscriptionContext.Provider value={{ tripId, setTripId }}>
      {children}
    </SupabaseSubscriptionContext.Provider>
  );
}

export function useSupabaseSubscriptionContext() {
  const ctx = useContext(SupabaseSubscriptionContext);
  if (!ctx) throw new Error('useSupabaseSubscriptionContext must be used inside ItineraryProvider');
  return ctx;
}
