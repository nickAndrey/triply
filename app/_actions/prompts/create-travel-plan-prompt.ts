export function createTravelPlanPrompt(params: {
  destination: string;
  travelDates: string[];
  budget: string; // e.g., "budget", "mid-range", "luxury", "5000 USD"
  preferences: string[];
}) {
  const startDate = new Date(params.travelDates[0]);
  const endDate = new Date(params.travelDates[1]);

  const tripDurationDays =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  let detailStrategy: string;

  if (tripDurationDays <= 7) {
    detailStrategy = 'Provide a detailed, day-by-day itinerary for the entire trip.';
  } else if (tripDurationDays <= 14) {
    detailStrategy =
      'Provide a detailed, day-by-day itinerary for the first 5-7 days. For the remaining days, provide a structured overview with 2-3 key activities per day.';
  } else {
    detailStrategy =
      'Provide 2-3 fully detailed sample days. For the remaining time, organize the itinerary by theme or region (e.g., "Cultural Highlights", "Coastal Adventures"), listing top attractions and restaurants for each area.';
  }

  // NEW: Map the user's budget input to a tier for the AI to understand
  const budgetTier = params.budget.toLowerCase().includes('luxury')
    ? '$$$'
    : params.budget.toLowerCase().includes('budget')
      ? '$'
      : '$$'; // default to mid-range

  return JSON.stringify({
    // ROLE & TASK - More Direct Commands
    role: "You are an expert travel consultant for 'The Insider's Travel Guide'. Your goal is to create a realistic, practical, and highly engaging travel itinerary.",
    primary_task: `Generate a personalized travel plan for a ${tripDurationDays}-day trip to ${params.destination} for a traveler with a ${params.budget} budget who enjoys ${params.preferences.join(', ')}.`,
    core_mandate:
      'You MUST be factual and practical. NEVER invent or hallucinate places, details, or prices. If you are unsure about a specific attraction or restaurant in a less-known location, focus on general, well-known activities and authentic local experiences instead.',

    // RESPONSE FORMAT - CRITICAL: This tells the AI the exact JSON structure to output.
    response_format: {
      instruction:
        'You MUST respond with **ONLY** a valid JSON object that matches the following schema. Do not include any introductory text, warnings, or commentary.',
      schema: {
        type: 'object',
        properties: {
          markdownContent: {
            type: 'string',
            description:
              'The full travel plan, formatted as a Markdown article adhering strictly to all rules below.',
          },
          metadata: {
            type: 'object',
            properties: {
              destination: { type: 'string' },
              travelDates: { type: 'array', items: { type: 'string' } },
              tripDuration: { type: 'integer' },
              budget: { type: 'string' },
              preferences: { type: 'array', items: { type: 'string' } },
              articleTitle: { type: 'string' },
              slug: { type: 'string' },
              detailNote: { type: 'string' },
            },
            required: [
              'destination',
              'travelDates',
              'tripDuration',
              'budget',
              'preferences',
              'articleTitle',
              'slug',
              'detailNote',
            ],
          },
        },
        required: ['markdownContent', 'metadata'],
      },
    },

    // CONTENT STRATEGY
    detail_strategy: detailStrategy,
    budget_context: `The user's budget level is '${params.budget}'. Interpret this as a '${budgetTier}' tier. Recommend activities and restaurants that are appropriate for this tier.`,

    // FORMATTING RULES - Simplified and with clearer priorities
    formatting_rules: [
      '1. **Title & Intro:** Start with a compelling title and a brief intro that sets the tone.',
      '2. **Structure:** Use hierarchical headings (## Day 1, ### Morning, #### Options).',
      `3. **Budget Handling:** ABSOLUTELY NEVER provide numerical prices. Use these symbols for every venue: 
         - $ = Budget-friendly (street food, free museums, public transit)
         - $$ = Mid-range (casual restaurants, paid attractions, taxis)
         - $$$ = Premium (fine dining, private tours, luxury hotels)`,
      '4. **Maps Links:** For EVERY place, embed a Google Maps link in the name: `[Place Name](https://www.google.com/maps/search/?api=1&query=Place+Name+City+Name)`.',
      '5. **Content:** For each activity, provide a brief, engaging description. Use **bold** for key recommendations (**Top Choice**, **Alternative**).',
      '6. **Practicality:** Include emojis sparingly (🚶‍♂️, 🍽️, 🏛️) and use blockquotes (> 💡 Insider Tip:) for useful advice.',
      "7. **Honesty:** If the destination is very specific or obscure, focus on general activities (e.g., 'explore the local markets,' 'visit the main historical church,' 'try a family-run restaurant') rather than inventing specific names.",
    ],

    // USER CONTEXT - Remains the same
    user_preferences: {
      Destination: params.destination,
      'Travel Dates': params.travelDates.join(' to '),
      'Trip Duration (days)': tripDurationDays,
      Budget: params.budget,
      Preferences: params.preferences.join(', '),
    },

    // UPDATED EXAMPLE - Shows the final JSON structure and desired content style
    example_output: {
      markdownContent:
        '# Sample Trip to Krakow\n\n...\n\n### Evening\nDine at [Pod Wawelem](https://www.google.com/maps/search/?api=1&query=Pod+Wawelem+Krakow) $$ - A reliable mid-range restaurant serving hearty Polish classics near the castle.\n\n> **Daily Summary:**\n> - Explored the historic Old Town.\n> - Enjoyed traditional Polish cuisine.',
      metadata: {
        destination: 'Krakow, Poland',
        travelDates: ['2024-10-01', '2024-10-05'],
        tripDuration: 5,
        budget: 'mid-range',
        preferences: ['history', 'food'],
        articleTitle: 'Krakow: A Historical and Culinary Journey',
        slug: 'krakow-history-food-5-day-trip',
        detailNote: 'full_detailed',
      },
    },
  });
}
