'use client';

import { useEffect, useState } from 'react';

import axios from 'axios';

import { deleteItinerary } from '@features/itinerary/actions/delete-itinerary';

import { useItineraryGenerationSubscriber } from '@providers/itinerary-generation-subscriber-context';
import { useRequest } from '@providers/request-context';

import { TravelItineraryForm } from '../_types/form/travel-itinerary-form';

export function useReplaceItineraryPrompt() {
  const { itinerary, setInitialItineraryId } = useItineraryGenerationSubscriber();
  const request = useRequest();

  const [itineraryIdToRemove, setItineraryIdToRemove] = useState<string | null>(null);

  useEffect(() => {
    const handleRemoveOldItinerary = async () => {
      if (!itinerary?.id) return;
      if (!itineraryIdToRemove) return;

      await deleteItinerary(itineraryIdToRemove);
    };

    if (itinerary?.id) {
      handleRemoveOldItinerary();
    }
  }, [itinerary?.id, itineraryIdToRemove]);

  const onReplaceItineraryPrompt = async (form: TravelItineraryForm, itineraryId: string) => {
    try {
      const { data } = await axios.post(
        '/api/suggestion/generate',
        { form },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setInitialItineraryId(data.itineraryId);
      setItineraryIdToRemove(itineraryId);
      request.start();
    } catch (error) {
      request.fail((error as Error).message);
    }
  };

  return { onReplaceItineraryPrompt };
}
