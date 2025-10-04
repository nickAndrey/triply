import { SuggestionFormFields } from '@/app/_actions/personal-suggestion/_types/form';

export function buildTripPlanPrompt(form: SuggestionFormFields) {
  const destination = form.destination;
  const [city, country = ''] = destination.split(',').map((s) => s.trim());

  const companions = (() => {
    switch (form.companions) {
      case 'Solo':
        return { type: 'Solo', adults: [], children: [], friends: [] };
      case 'Couple':
        return { type: 'Couple', adults: form.adults || [{ adult: 2 }], children: [], friends: [] };
      case 'Family':
        return { type: 'Family', adults: form.adults || [{ adult: 2 }], children: form.children || [], friends: [] };
      case 'Friends':
        return { type: 'Friends', adults: [], children: [], friends: form.friends || [{ friend: 3 }] };
      default:
        return { type: 'Solo', adults: [], children: [], friends: [] };
    }
  })();

  return `
    You are a travel planner. Generate a personalized trip plan.

    ### Output Requirements
    - Respond ONLY with valid JSON.
    - Must pass JSON.parse() with no errors.
    - No text outside JSON.

    ---

    ### Root JSON Object Fields
    - "destination": string → Full destination name (e.g. "Warsaw, Poland").
    - "city": string → City name only (e.g. "Warsaw").
    - "country": string → Country name only (e.g. "Poland").
    - "tripDurationDays": number → Total trip length in days.
    - "season": "Winter" | "Spring" | "Summer" | "Autumn".
    - "companions": object → Traveler group:
      - "type": "Solo" | "Couple" | "Family" | "Friends".
      - "adults": array of { "adult": number } (if Family).
      - "children": array of { "child": number, "group": "0-3" | "4-9" | "10-16" } (if Family).
      - "friends": array of { "friend": number } (if Friends).
    - "tripVibe": "Beach" | "City" | "Nature".
    - "pace": "Slow" | "Balanced" | "Fast".
    - "activityIntensity": "Sedentary" | "Light" | "High".
    - "planningStyle": "Hour-by-Hour" | "Loose Outline" | "Go With the Flow".
    - "foodPreferences": array of 
      - "LocalSpecialties" | "StreetFood" | "FineDining" | "VeganFriendly" | "CoffeeAndCafes" | "WineAndBars".
    - "foodRestrictions": string (e.g. "Vegetarian", "Halal", "Gluten-Free") or "none".
    - "budget": "Free" | "$" | "$$" | "$$$".
    - "placesToSee": string | "none".
    - "placesAvoidToSee": string | "none".
    - "tripSuccessDefinition": string | "not specified".
    - "perfectDay": string | "not specified".
    - "tripSummary": string → A 1–2 sentence factual overview of the whole trip.
    - "tripConclusion": string → A warm, emotional closure to end the journey.
    - "days": array of day objects.

    ---

    ### Day Object Schema
    - "dayNumber": number → Sequential day index.
    - "theme": string → Creative theme/title for the day.
    - "summary": string → 1–2 sentences describing the day’s vibe.
    - "morning": array of activity objects (count based on pace & intensity).
    - "afternoon": array of activity objects (count based on pace & intensity).
    - "evening": array of activity objects (count based on pace & intensity).
    - "insiderTips": array of 2–3 short strings → Practical/local advice.
    - "hiddenGem": string → One lesser-known, real spot in the city.

    ---

    ### Activity Object Schema
    - "name": string → Real place, must exist.
    - "description": string → Short narrative (why it’s worth visiting).
    - "budget": "Free" | "$" | "$$" | "$$$".
    - "type": "activity" | "restaurant" | "cafe" | "bar".

    ---

    ### Rules
    - All places must exist (no fictional names).
    - Use "Free" for public spaces, viewpoints, walking areas, or free attractions.
    - Use "$" for coffee/snacks or very cheap activities.
    - Use "$$" for mid-range meals, typical museums, or moderate activities.
    - Use "$$$" for fine dining, upscale bars, or high-cost attractions.
    - Write all descriptions in the "${form.toneStyle || 'Balanced'}" style:
      - "Vivid" → sensory language, emotional tone, immersive storytelling.
      - "Historical" → include local history, cultural background, interesting facts.
      - "Balanced" → keep things engaging but informative, a mix of vivid and factual.
    - Match number of activities per block to traveler's **pace** and **activityIntensity**:
      - Slow + Sedentary → 1 per block  
      - Slow + Light → 1–2 per block  
      - Balanced + Light → 2 per block  
      - Balanced + High → 2–3 per block  
      - Fast + High → 3 per block  
    - Activities must align with:
      - Season (Winter, Spring, Summer, Autumn)
      - Destination city & country
      - Companion context ("companions" structure)
      - Food preferences & dietary restrictions
    - Food stops must explicitly respect dietary restrictions.
    - "tripSummary" must be concise & factual.
    - "tripConclusion" must be warm, emotional closure.
    - Ensure every required JSON key is present.
    - Do not add fields outside schema.

    ---

    ### Input Context
    The trip request is based on the following traveler input:

    {
      "destination": "${form.destination}",
      "city": "${city}",
      "country": "${country}",
      "tripDurationDays": ${form.tripDurationDays},
      "season": "${form.season}",
      "companions": ${JSON.stringify(companions, null, 2)},
      "tripVibe": "${form.tripVibe}",
      "pace": "${form.pace}",
      "activityIntensity": "${form.activityIntensity}",
      "planningStyle": "${form.planningStyle}",
      "foodPreferences": ${JSON.stringify(form.foodPreferences)},
      "foodRestrictions": "${form.foodRestrictions || 'none'}",
      "budget": "${form.budget}",
      "placesToSee": "${form.placesToSee || 'none'}",
      "placesAvoidToSee": "${form.placesAvoidToSee || 'none'}",
      "tripSuccessDefinition": "${form.tripSuccessDefinition || 'not specified'}",
      "perfectDay": "${form.perfectDay || 'not specified'}"
    }

    Generate a complete valid JSON trip plan that follows the schema above.
  `;
}
