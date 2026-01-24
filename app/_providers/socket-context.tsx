'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { io, Socket } from 'socket.io-client';

export const SocketEvent = {
  JOIN_ITINERARY: 'join_itinerary',
  LEAVE_ITINERARY: 'leave_itinerary',
  ITINERARY_CREATED: 'itinerary:created',
  ITINERARY_UPDATED: 'itinerary:updated',
  ITINERARY_COMPLETED: 'itinerary:completed',
  ITINERARY_FAILED: 'itinerary:failed',
} as const;

type SocketContextState = {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  joinItinerary: (itineraryId: string) => void;
  leaveItinerary: (itineraryId: string) => void;
};

const SocketContext = createContext<SocketContextState | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = (): Promise<void> => {
    if (socket?.connected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
        withCredentials: true,
        autoConnect: true,
      });

      newSocket.on('connect', () => {
        setSocket(newSocket);
        setIsConnected(true);
        resolve();
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        reject(error);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  };

  const disconnect = () => {
    socket?.disconnect();
    setSocket(null);
    setIsConnected(false);
  };

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  const joinItinerary = (itineraryId: string) => {
    socket?.emit(SocketEvent.JOIN_ITINERARY, itineraryId);
  };

  const leaveItinerary = (itineraryId: string) => {
    socket?.emit(SocketEvent.LEAVE_ITINERARY, itineraryId);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        connect,
        disconnect,
        joinItinerary,
        leaveItinerary,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return ctx;
}
