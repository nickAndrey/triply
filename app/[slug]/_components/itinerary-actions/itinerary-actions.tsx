'use client';

import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';

import { ActionDialog } from './components/action-dialog';
import { ItineraryActionsPanel } from './components/itinerary-actions-panel';
import { useItineraryActions } from './hooks/use-itinerary-actions';

type Props = {
  itinerary: TravelItineraryRow;
};

export function ItineraryActions({ itinerary }: Props) {
  const itineraryActions = useItineraryActions(itinerary);

  return (
    <>
      <ItineraryActionsPanel {...itineraryActions} />
      <ActionDialog {...itineraryActions} />
    </>
  );
}
