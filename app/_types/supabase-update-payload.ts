export type TravelItineraryDay = {
  markdownContent: string;
  metadata: {
    activityIntensity: string;
    articleTitle: string;
    budget: string;
    companions: string;
    dayNumber: number;
    daySummary: string;
    destination: string;
    foodAdventure: string;
    pace: string;
    planningStyle: string;
    season: string;
    slug: string;
    themesUsed: string[];
    travelDates: string[];
    tripDuration: number;
    tripVibe: string;
    visitedPlaces: string[];
  };
};

export type TravelItineraryForm = {
  activityIntensity: string;
  adults?: { adult: number }[];
  budget: '$' | '$$' | '$$$';
  children?: { child: number; group: string }[];
  companions: string;
  destination: string;
  destinationSearch: string;
  foodPreferences: string[];
  foodRestrictions?: string;
  friends?: { friend: number }[];
  pace: string;
  perfectDay?: string;
  placesAvoidToSee?: string;
  placesToSee?: string;
  planningStyle: string;
  season: string;
  tripDurationDays: string;
  tripSuccessDefinition?: string;
  tripVibe: string;
};

export type TravelItineraryRow = {
  created_at: string;
  days: TravelItineraryDay[];
  final_markdown: string | null;
  final_metadata: TravelItineraryDay['metadata'] | null;
  form: TravelItineraryForm;
  id: string;
  status: 'in_progress' | 'completed' | string;
  updated_at: string;
  user_id: string;
};

export type SupabaseUpdatePayload = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: TravelItineraryRow;
  old: Partial<TravelItineraryRow>;
  errors: Record<string, unknown>;
};
