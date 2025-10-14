'use client';

import { deleteItinerary } from '@features/itinerary/actions/delete-itinerary';

import { useRequest } from '@providers/request-context';

export function useItineraryDelete() {
  const request = useRequest();

  const handleItineraryDelete = async (id: string) => {
    const currentLocationPath = window.location.pathname?.split('/')[1];

    try {
      request.start();
      await deleteItinerary(id, currentLocationPath);

      request.finish({
        message: 'The trip has been removed successfully',
      });
    } catch (err) {
      request.fail((err as Error).message);
    }
  };

  return { handleItineraryDelete };
}
