'use client';

import { duplicateItinerary } from '@features/itinerary/actions/duplicate-itinerary';

import { useRequest } from '@providers/request-context';

export function useDuplicateItinerary() {
  const request = useRequest();

  const onDuplicateItinerary = async (id: string) => {
    try {
      request.start('Starting duplicate itinerary');
      await duplicateItinerary(id);
      request.finish('Itinerary have been duplicated');
    } catch (error) {
      console.error((error as Error).message);
      request.fail((error as Error).message);
    }
  };

  return { onDuplicateItinerary };
}
