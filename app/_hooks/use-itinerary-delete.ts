'use client';

import { useRouter } from 'next/navigation';

import { deleteTrip } from '@features/itinerary/actions/delete-trip';

import { useRequest } from '@providers/request-context';

export function useItineraryDelete() {
  const request = useRequest();

  const router = useRouter();

  const handleItineraryDelete = async (id: string, slug: string) => {
    try {
      request.start();
      await deleteTrip(id);
      request.finish({ message: 'The trip has been removed successfully' });

      if (window.location.pathname.includes(slug)) {
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 800);
      } else {
        router.refresh();
      }
    } catch (err) {
      request.fail((err as Error).message);
    }
  };

  return { handleItineraryDelete };
}
