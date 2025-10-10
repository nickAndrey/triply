/**
 * @deprecated use app/_types/db/travel-itinerary-row.ts instead
 */
export type SubscriberGenerationStatus =
  | 'idle' // Nothing in progress
  | 'core_generating' // AI generating trip core (before DB insert)
  | 'core_ready' // Core inserted into DB, tripId available
  | 'days_generating' // Days are being added in realtime
  | 'completed' // All days generated
  | 'error';
