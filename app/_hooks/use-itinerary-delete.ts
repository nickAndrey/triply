'use client';

import { useRouter } from 'next/navigation';

import { deleteItinerary } from '@features/itinerary/actions/delete-itinerary';

import { useRequest } from '@providers/request-context';

export function useItineraryDelete() {
  const request = useRequest();

  const router = useRouter();

  const handleItineraryDelete = async (id: string, slug: string) => {
    try {
      request.start();
      await deleteItinerary(id);

      request.finish({
        message: 'The trip has been removed successfully',
      });

      if (window.location.pathname.includes(slug)) {
        setTimeout(() => router.push('/'), 800);
      }
    } catch (err) {
      request.fail((err as Error).message);
    }
  };

  return { handleItineraryDelete };
}
