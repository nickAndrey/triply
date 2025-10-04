export type TripPlan = {
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
  budget: 'Free' | '$' | '$$' | '$$$';
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

export type Activity = {
  name: string;
  description: string;
  budget: 'Free' | '$' | '$$' | '$$$';
  type: 'activity' | 'restaurant' | 'cafe' | 'bar';
};
