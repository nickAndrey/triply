'use client';

import axios from 'axios';

import { useItineraryGenerationSubscriber } from '@providers/itinerary-generation-subscriber-context';
import { useRequest } from '@providers/request-context';

import { TravelItineraryForm } from '../_types/form/travel-itinerary-form';

export function useCreateItineraryFromPrompt() {
  const { setInitialItineraryId } = useItineraryGenerationSubscriber();

  const { start, fail } = useRequest();

  const onCreateItineraryFromPrompt = async (form: TravelItineraryForm) => {
    try {
      start();
      const { data } = await axios.post(
        '/api/suggestion/generate',
        { form },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setInitialItineraryId(data.itineraryId);
    } catch (error) {
      console.error('Error occurred attempting to generate suggestion');
      fail((error as Error).message);
      throw error;
    }
  };

  return { onCreateItineraryFromPrompt };
}
