import { SuggestionFormFields } from '@/app/_actions/personal-suggestion/_types/form';

export function buildTripCorePrompt(form: SuggestionFormFields) {
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
    You are a travel planner. Generate the **trip plan core** as JSON.

    ### Output Requirements
    - Respond ONLY with valid JSON.
    - Must pass JSON.parse() with no errors.
    - No text outside JSON.

    ---

    ### Root JSON Object Fields
    - "destination": string → Full destination name (e.g. "Warsaw, Poland").
    - "city": string → City name only.
    - "country": string → Country name only.
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
    - "tripSummary": string → Overview of the whole trip.
    - "tripConclusion": string → Closing reflection at the end of the journey.
    - "articleTitle": string → Title summarizing the trip.
    - "slug": string → URL-safe slug (lowercase, hyphenated, no special characters, e.g. "5-days-in-rome").
    - "days": []

    ---

    ### Rules
    - Do not generate any days yet — only provide the trip core.
    - All fields listed above must be included, even if empty or "not specified".
    - The following fields must reflect the selected "${form.toneStyle || 'Balanced'}" writing tone:
      - "articleTitle"
      - "tripSummary"
      - "tripConclusion"
    - Write all text in the "${form.toneStyle || 'Balanced'}" style:
      - "Vivid" → sensory, emotional, immersive.
      - "Historical" → local history, cultural context, interesting facts.
      - "Balanced" → mix of vivid and factual.
    - Ensure strict JSON validity.
    - Do not add fields outside the schema.

    ---

    ### Input Context
    The trip request is based on:

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
  `;
}
