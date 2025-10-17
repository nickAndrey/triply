export type TripCore = {
  navTitle: string;
  destination: string;
  city: string;
  country: string;
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
  foodRestrictions: string;
  budget: '$' | '$$' | '$$$';
  placesToSee: string | 'none';
  placesAvoidToSee: string | 'none';
  tripSuccessDefinition: string | 'not specified';
  perfectDay: string | 'not specified';
  tripSummary: string;
  tripConclusion: string;
  articleTitle: string;
  slug: string;
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
