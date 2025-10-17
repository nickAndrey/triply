/**
 * @deprecated use `app/_types/trip/*` types instead
 */
export type TripPlan = {
  navTitle: string; // by default set to "TripPlan.city" value
  destination: string; // Full destination name (e.g. "Warsaw, Poland")
  city: string; // City name only
  country: string; // Country name only
  tripDurationDays: number;
  season: 'Winter' | 'Spring' | 'Summer' | 'Autumn';
  companions: Companions;
  tripVibe: 'Beach' | 'City' | 'Nature';
  pace: 'Slow' | 'Balanced' | 'Fast';
  activityIntensity: 'Sedentary' | 'Light' | 'High';
  planningStyle: 'Hour-by-Hour' | 'Loose Outline' | 'Go With the Flow';
  foodPreferences: (
    | 'LocalSpecialties'
    | 'StreetFood'
    | 'FineDining'
    | 'VeganFriendly'
    | 'CoffeeAndCafes'
    | 'WineAndBars'
  )[];
  foodRestrictions: string; // e.g. "Vegetarian", "Halal", or "none"
  budget: '$' | '$$' | '$$$';
  placesToSee: string | 'none';
  placesAvoidToSee: string | 'none';
  tripSuccessDefinition: string | 'not specified';
  perfectDay: string | 'not specified';
  tripSummary: string;
  tripConclusion: string;
  articleTitle: string;
  slug: string;
  days: Day[];
};
/**
 * @deprecated use `app/_types/trip/*` types instead
 */
export type Companions =
  | { type: 'Solo' }
  | { type: 'Couple' }
  | {
      type: 'Family';
      adults: { adult: number }[];
      children: { child: number; group: '0-3' | '4-9' | '10-16' }[];
    }
  | {
      type: 'Friends';
      friends: { friend: number }[];
    };
/**
 * @deprecated use `app/_types/trip/*` types instead
 */
export type Day = {
  dayNumber: number;
  theme: string;
  summary: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  insiderTips: [string, string, ...string[]]; // at least 2
  hiddenGem: string;
};
/**
 * @deprecated use `app/_types/trip/*` types instead
 */
export type Activity = {
  name: string;
  description: string;
  budget: '$' | '$$' | '$$$';
  type: 'activity' | 'restaurant' | 'cafe' | 'bar';
};
