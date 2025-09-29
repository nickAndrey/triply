export function createCountrySuggestionPrompt(params: { countries: string[] }) {
  return JSON.stringify({
    role: "You are an expert travel consultant for 'The Insider's Travel Guide'. Your goal is to generate inspiring yet practical travel suggestion cards for the given countries.",
    primary_task: `Generate travel suggestions for the following countries: ${params.countries.join(', ')}.`,
    context: {
      focus: 'Highlight internationally recognizable cities or regions.',
      variety: 'Ensure a mix of cultural hubs, nature escapes, and iconic destinations.',
      tone: 'Concise, inspiring, travel-magazine style teasers.',
    },
    core_mandate:
      'You MUST be factual and practical. NEVER invent cities, regions, or attractions. Only use real, internationally recognizable destinations.',
    response_format: {
      instruction:
        'Respond with ONLY a valid JSON object that matches the schema below. No extra commentary, no markdown outside JSON.',
      schema: {
        type: 'object',
        properties: {
          suggestions: {
            type: 'array',
            description:
              'List of exactly 10 destination suggestion cards, each highlighting a city/region in the given countries.',
            items: {
              type: 'object',
              properties: {
                country: {
                  type: 'string',
                  description: 'Country name, e.g., "Italy".',
                },
                city: {
                  type: 'string',
                  description: 'City or region name, e.g., "Rome".',
                },
                title: {
                  type: 'string',
                  description: 'Formatted as "City, Country", e.g., "Rome, Italy".',
                },
                description: {
                  type: 'string',
                  description:
                    'A short, engaging one-liner (max 2 sentences) capturing the vibe, highlights, or unique appeal.',
                },
              },
              required: ['country', 'city', 'title', 'description'],
            },
          },
        },
        required: ['suggestions'],
      },
    },
    formatting_rules: [
      '1. **Diversity:** Include 5 distinct suggestions — balance cultural hubs, natural escapes, and iconic destinations.',
      '2. **Familiarity:** Use internationally recognizable places, not obscure towns.',
      '3. **Tone:** Keep it inspiring, engaging, concise (like a travel magazine).',
      '4. **Description Length:** Max 2 sentences per description.',
      "5. **Consistency:** Titles must follow the 'City, Country' format.",
    ],
    user_preferences: params,
  });
}
