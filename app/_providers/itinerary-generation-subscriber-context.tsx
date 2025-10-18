'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import axios from 'axios';

import { createClient } from '@/utils/supabase/client';

import { DB_TABLES } from '../_constants/db-tables';
import { TravelItineraryRow } from '../_types/db/travel-itinerary-row';
import { useRequest } from './request-context';

type Params = {
  itinerary: TravelItineraryRow | null;
  userDismissed: boolean;
  setUserDismissed: (value: boolean) => void;
  setInitialItineraryId: (id: string) => void;
  handleResume: (incompleteItinerary: TravelItineraryRow | null) => Promise<void>;
};

const ItineraryGenerationSubscriberContext = createContext<Params>({
  itinerary: null,
  userDismissed: false,
  setUserDismissed: () => {},
  setInitialItineraryId: () => {},
  handleResume: async () => {},
});

type Props = {
  children: ReactNode;
};

export function ItineraryGenerationSubscriberProvider({ children }: Props) {
  const { start, finish } = useRequest();
  const [initialItineraryId, setInitialItineraryId] = useState<string | undefined>();

  const [userDismissed, setUserDismissed] = useState(false);
  const [itinerary, setItinerary] = useState<TravelItineraryRow | null>(null);

  const handleResume = useCallback(
    async (incompleteItinerary: TravelItineraryRow | null) => {
      if (!incompleteItinerary) return;
      start();
      await axios.post('/api/suggestion/resume', { itinerary: incompleteItinerary });
    },
    [start]
  );

  useEffect(() => {
    let isActive = true;

    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id || !isActive) return;

      const { data } = await supabase
        .from(DB_TABLES.travel_itineraries)
        .select('*')
        .neq('trip_status', 'completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!data || !isActive) return;

      const incompleteItinerary = data as TravelItineraryRow;
      setItinerary(incompleteItinerary);

      if (incompleteItinerary.trip_status !== 'failed') {
        console.log('Resuming unfinished itinerary generation...');
        await handleResume(incompleteItinerary);
      }
    };

    init();

    return () => {
      isActive = false;
    };
  }, [finish, start, handleResume, initialItineraryId]);

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
            setItinerary((prev) => {
              const prevDays = prev?.trip_days ?? [];
              const newDays = newItinerary.trip_days ?? [];

              return {
                ...prev,
                ...newItinerary,
                trip_days: newDays.length > prevDays.length ? newDays : prevDays,
              };
            });

            if (newItinerary.trip_status === 'completed' || newItinerary.trip_status === 'failed') {
              channel.unsubscribe();
              finish();
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [itinerary?.id]);

  const value = useMemo(
    () => ({
      itinerary,
      userDismissed,
      setUserDismissed,
      setInitialItineraryId,
      handleResume,
    }),
    [itinerary, userDismissed, handleResume]
  );

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
