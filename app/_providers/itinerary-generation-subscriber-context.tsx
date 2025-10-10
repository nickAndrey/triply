'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import axios from 'axios';

import { createClient } from '@/utils/supabase/client';

import { DB_TABLES } from '../_constants/db-tables';
import { TravelItineraryRow } from '../_types/db/travel-itinerary-row';
import { useRequest } from './request-context';

type Params = {
  itinerary: TravelItineraryRow | null;
};

const ItineraryGenerationSubscriberContext = createContext<Params>({
  itinerary: null,
});

type Props = {
  children: ReactNode;
};

export function ItineraryGenerationSubscriberProvider({ children }: Props) {
  const { start, finish } = useRequest();

  const [itinerary, setItinerary] = useState<TravelItineraryRow | null>(null);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) return;

      const { data } = await supabase
        .from(DB_TABLES.travel_itineraries)
        .select('*')
        .neq('trip_status', 'completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!data) return;

      const incompleteItinerary = data as TravelItineraryRow;

      setItinerary(incompleteItinerary);

      if (incompleteItinerary.trip_status !== 'failed') {
        console.log('Resuming unfinished itinerary generation...');

        await axios.post(
          '/api/suggestion/resume',
          { itinerary: incompleteItinerary },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    };

    init();
  }, [finish, start]);

  useEffect(() => {
    if (!itinerary?.id) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`itinerary-${itinerary.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: DB_TABLES.travel_itineraries,
          filter: `id=eq.${itinerary.id}`,
        },
        async (payload: RealtimePostgresChangesPayload<TravelItineraryRow>) => {
          const newItinerary = payload.new;

          if (newItinerary && typeof newItinerary === 'object' && 'trip_days' in newItinerary) {
            setItinerary((prev) => (prev ? { ...prev, ...newItinerary } : newItinerary));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [itinerary?.id]);

  const value = useMemo(() => ({ itinerary }), [itinerary]);

  return (
    <ItineraryGenerationSubscriberContext.Provider value={value}>
      {children}
    </ItineraryGenerationSubscriberContext.Provider>
  );
}

export function useItineraryGenerationSubscriber() {
  const ctx = useContext(ItineraryGenerationSubscriberContext);
  if (!ctx) {
    throw new Error('useItineraryGenerationSubscriber must be used within ItineraryGenerationSubscriberContext');
  }
  return ctx;
}
