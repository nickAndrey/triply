'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import axios from 'axios';

import { useRequest } from '@providers/request-context';
import { initTripStatus } from '@providers/supabase-subscriptions/_utils/init-trip-status';
import { resolveTripStatus } from '@providers/supabase-subscriptions/_utils/status-resolver';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { TravelItineraryRow } from '@/app/_types/supabase-update-payload';
import { createClient } from '@/utils/supabase/client';

export type SubscriberStatus = 'idle' | 'core_generating' | 'core_ready' | 'days_generating' | 'completed' | 'error';

type ContextType = {
  tripId: string;
  setTripId: (id: string) => void;
  subscriberStatus: SubscriberStatus;
  setSubscriberStatus: (status: SubscriberStatus) => void;
  slug: string;
  tripData: TravelItineraryRow | null;
  currentDay?: number;
};

const SupabaseSubscriptionContext = createContext<ContextType | undefined>(undefined);

export function SupabaseSubscriptionProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { start, finish } = useRequest();

  const [tripId, setTripId] = useState('');
  const [subscriberStatus, setSubscriberStatus] = useState<SubscriberStatus>('idle');
  const [slug, setSlug] = useState('');
  const [currentDay, setCurrentDay] = useState<number>();
  const [tripData, setTripData] = useState<TravelItineraryRow | null>(null);

  useEffect(() => {
    async function bootstrap() {
      const result = await initTripStatus();
      if (!result) return;

      const { trip, status } = result;
      setTripId(trip.id);
      setSubscriberStatus(status);

      if (status === 'completed') finish();
      else start();
    }

    bootstrap();
  }, [start, finish]);

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
          const newPayload = payload.new;

          if (!newPayload || typeof newPayload !== 'object' || !('trip_plan_details' in newPayload)) {
            console.warn('Invalid payload received:', newPayload);
            return;
          }

          const trip = newPayload;
          const days = trip.trip_plan_details?.days ?? [];

          setCurrentDay(days.length === 0 ? 1 : days.length);
          setTripData(trip);

          if (trip.trip_plan_details?.slug) setSlug(trip.trip_plan_details.slug);

          const status = resolveTripStatus(trip);
          setSubscriberStatus(status);

          if (status === 'completed') finish();

          await axios.post('/api/revalidate', { paths: [`/${trip.trip_plan_details.slug}`] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, supabase, finish]);

  return (
    <SupabaseSubscriptionContext.Provider
      value={{
        tripData,
        tripId,
        setTripId,
        subscriberStatus,
        setSubscriberStatus,
        slug,
        currentDay,
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
