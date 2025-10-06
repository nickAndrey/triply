'use client';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { useRequest } from '@/app/_providers/request-context';
import { TravelItineraryRow } from '@/app/_types/supabase-update-payload';
import { createClient } from '@/utils/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import axios from 'axios';
import { differenceInSeconds } from 'date-fns';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

type SubscriberStatus = 'idle' | 'core_generating' | 'core_ready' | 'days_generating' | 'completed' | 'error';

type ContextType = {
  tripId: string;
  setTripId: (id: string) => void;
  subscriberStatus: SubscriberStatus;
  setSubscriberStatus: (status: SubscriberStatus) => void;
  progressPercent: number;
  currentDay: number;
  totalDays: number;
  slug: string;
};

const SupabaseSubscriptionContext = createContext<ContextType | undefined>(undefined);

export function SupabaseSubscriptionProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const { start, finish } = useRequest();

  const [tripId, setTripId] = useState('');
  const [subscriberStatus, setSubscriberStatus] = useState<SubscriberStatus>('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [slug, setSlug] = useState('');

  // Prevent mount logic from overriding realtime
  const initialized = useRef(false);

  // --- Shared status resolver
  const resolveStatus = (trip: TravelItineraryRow): SubscriberStatus => {
    if (!trip) return 'idle';
    if (trip.status === 'failed') return 'error';

    const days = trip.trip_plan_details?.days ?? [];
    const duration = parseInt(trip.form?.tripDurationDays || '1');

    if (days.length === 0) return 'core_generating';
    if (days.length === 1) return 'core_ready';
    if (days.length < duration) return 'days_generating';
    if (days.length >= duration) return 'completed';

    return 'idle';
  };

  // --- Initial load: check for active trip
  useEffect(() => {
    const getActiveTrip = async () => {
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

      if (!trip) return;

      setTripId(trip.id);
      start();

      const status = resolveStatus(trip as TravelItineraryRow);
      setSubscriberStatus(status);

      if (status === 'completed') finish();

      // check if stuck
      const diff = differenceInSeconds(new Date(), new Date(trip.updated_at));
      if (trip.status === 'in_progress' && diff > 60) {
        await axios.post('/api/suggestion/resume', { tripId: trip.id });
      }

      initialized.current = true;
    };

    getActiveTrip();
  }, [supabase, start, finish]);

  // --- Realtime subscription
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
          const raw = payload.new;

          // 🛡️ Type guard
          if (!raw || typeof raw !== 'object' || !('trip_plan_details' in raw)) {
            console.warn('Invalid payload received:', raw);
            return;
          }
          const trip = raw;

          const days = trip.trip_plan_details?.days ?? [];
          const duration = parseInt(trip.form?.tripDurationDays || '1');
          const percent = Math.round((days.length / duration) * 100);
          setProgressPercent(percent);
          setCurrentDay(days.length);
          setTotalDays(duration);

          if (trip.trip_plan_details?.slug) setSlug(trip.trip_plan_details.slug);

          const status = resolveStatus(trip);
          setSubscriberStatus(status);
          if (status === 'completed') finish();

          await axios.post('/api/revalidate', {
            paths: ['/', trip.trip_plan_details?.slug ? `/${trip.trip_plan_details.slug}` : '/'],
          });

          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, tripId, router, finish]);

  return (
    <SupabaseSubscriptionContext.Provider
      value={{
        tripId,
        setTripId,
        subscriberStatus,
        setSubscriberStatus,
        progressPercent,
        currentDay,
        totalDays,
        slug,
      }}
    >
      {children}
    </SupabaseSubscriptionContext.Provider>
  );
}

export function useSupabaseSubscriptionContext() {
  const ctx = useContext(SupabaseSubscriptionContext);
  if (!ctx) throw new Error('useSupabaseSubscriptionContext must be used inside SupabaseSubscriptionProvider');
  return ctx;
}
