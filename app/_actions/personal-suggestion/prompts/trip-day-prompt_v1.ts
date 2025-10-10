import { SuggestionFormFields } from '@server-actions/personal-suggestion/types/form';

export function buildTripDayPrompt(form: SuggestionFormFields) {
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
    You are a travel planner. Generate the **plan for a single day** of the trip as JSON.

    ### Output Requirements
    - Respond ONLY with valid JSON.
    - Must pass JSON.parse() with no errors.
    - No text outside JSON.

    ---

    ### Day Object Schema
    - "dayNumber": number → Sequential day index (must be ${form.currentDay}).
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
    - Generate exactly one valid "day" object, nothing else.
    - Do not repeat places already visited: ${form.context?.visitedPlaces?.join(', ') || 'none'}.
    - Avoid reusing themes already used: ${form.context?.themesUsed?.join(', ') || 'none'}.
    - Ensure the new summary is distinct from previous summaries: ${form.context?.previousDaySummaries?.join('; ') || 'none'}.
    - All places must exist (no fictional names).
    - Use "Free" for public spaces, viewpoints, walking areas, or free attractions.
    - Use "$" for coffee/snacks or very cheap activities.
    - Use "$$" for mid-range meals, typical museums, or moderate activities.
    - Use "$$$" for fine dining, upscale bars, or high-cost attractions.
    - Write all descriptions in the "${form.toneStyle || 'Balanced'}" style:
      - "Vivid" → sensory language, emotional tone, immersive storytelling.
      - "Historical" → include local history, cultural background, interesting facts.
      - "Balanced" → keep things engaging but informative, a mix of vivid and factual.
    - Match number of activities per block to traveler’s **pace** and **activityIntensity**:
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
