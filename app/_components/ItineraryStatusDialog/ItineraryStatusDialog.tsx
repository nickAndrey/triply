'use client';

import { useSocket } from '@providers/socket-context';

export function ItineraryStatusDialog() {
  const { socket, isConnected, connect, disconnect, joinItinerary, leaveItinerary } = useSocket();
  return <div>ItineraryStatusDialog</div>;
}
