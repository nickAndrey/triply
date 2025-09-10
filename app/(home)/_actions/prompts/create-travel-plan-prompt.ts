export function createTravelPlanPrompt(params: {
  destination: string;
  travelDates: string[];
  budget: string;
  preferences: string[];
}) {
  // Calculate the number of days from the travelDates
  const startDate = new Date(params.travelDates[0]);
  const endDate = new Date(params.travelDates[1]);
  const tripDurationDays =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Define a strategy based on trip length
  let detailStrategy: string;

  if (tripDurationDays <= 7) {
    detailStrategy =
      'Provide a detailed, day-by-day itinerary for the entire trip, following all content rules for each day.';
  } else if (tripDurationDays <= 14) {
    detailStrategy =
      'Provide a detailed, day-by-day itinerary for the first 5-7 days. For the remaining days, provide a structured overview with 2-3 key activities per day and notable restaurant suggestions, but with less narrative detail to conserve space.';
  } else {
    // For long trips (e.g., 2 weeks to a month)
    detailStrategy = `
      Due to the extended length of this trip, provide a highly structured but concise plan.
      1. **Detailed Template:** Provide 2-3 fully detailed sample days (e.g., "A Cultural Day in Paris", "A Day Trip to Versailles"). These should follow all content rules and serve as a template.
      2. **Thematic Overview:** For the remaining days, organize the itinerary by theme or region rather than by date. For each theme/region:
          - List the top 3-5 must-see attractions and experiences.
          - Suggest 2-3 highly recommended restaurants for that area.
          - Provide a logical route or grouping for these activities.
      3. **Flexible Structure:** Empower the user to mix and match these thematic blocks to build their own days. The goal is to provide the essential information and inspiration without a rigid, day-by-day breakdown for a full month.
    `;
  }

  return JSON.stringify({
    user: "You are an AI travel writer for 'The Insider's Travel Guide'. Your task is to create a personalized, engaging, and highly detailed travel article in the form of an itinerary.",
    task: "Generate a detailed travel plan based on the user's unique preferences. CRITICAL: You MUST be concise and manage the length of your response effectively. The following strategy must be applied based on the trip duration:",
    detail_strategy: detailStrategy,
    response_format:
      'Respond **only** with a valid JSON object. Do not include any other text or commentary outside the JSON structure.',
    formatting_instructions: {
      structure:
        'Use clear hierarchical headings (## Day X, ### Morning, #### Activity Options) to create visual structure.',
      spacing:
        'Use blank lines between sections and paragraphs to improve readability. Avoid wall-of-text formatting.',
      lists: 'Use bullet points for options and numbered lists for sequences where order matters.',
      emphasis:
        'Use **bold** for key recommendations, ranking labels (Top Choice, Alternative), and important details like costs or times.',
      visual_elements:
        'Incorporate emojis as visual cues where appropriate (🚶‍♂️ for walking, 🍽️ for dining, 💰 for costs, etc.).',
      breaks:
        "Use horizontal rules (---) to separate major sections if needed, but don't overuse them.",
      boxes:
        'Create information boxes using Markdown blockquotes (>) for tips, warnings, or summaries.',
      maps_links:
        'For EVERY mentioned place (attractions, restaurants, hotels, etc.), include a Google Maps link using this format: [Place Name](https://www.google.com/maps/search/?api=1&query=Place+Name,City+Name). Use the exact place name and city name for accurate results.',
    },
    json_schema: {
      markdownContent: {
        description:
          'The full trip plan formatted as a compelling Markdown article. It must adhere to all the content and formatting rules listed below, while following the detail strategy above.',
        rules: [
          "1. **Title & Introduction:** Start with a compelling title. Follow with a brief introduction that addresses the user's preferences and outlines the structure of the itinerary.",
          '2. **Structure:** Follow the detail strategy defined above. Use H2 headers (##) for each detailed day or thematic section. Use H3 headers (###) for time blocks (Morning/Afternoon/Evening) or major activity categories.',
          '3. **Activity Sections:** Within each detailed day, use H4 headers (####) for activity options. Use bullet points for lists of options, and bold text for ranking labels (**Top Choice:**, **Alternative:**).',
          '4. **Rich, Personalized Content:** For each activity in detailed sections: Weave in narrative, provide ranked options, bind locations, include practical details.',
          '5. **Google Maps Links:** For EVERY mentioned place (attractions, restaurants, hotels, etc.), include a Google Maps link using this format: [Place Name](https://www.google.com/maps/search/?api=1&query=Place+Name,City+Name). Use the exact place name and city name for accurate results.',
          '6. **Visual Hierarchy:** Use blank lines between paragraphs and sections. Avoid long, unbroken blocks of text.',
          '7. **Practical Details:** Use **bold** for important practical information like costs, times, and transportation details.',
          "8. **Local Insights:** Include '> 💡 Insider Tip:' callouts in blockquotes for special recommendations.",
          "9. **Flexibility:** Offer optional activities in separate sections with headers like 'If You Have Extra Time'.",
          '10. **Daily Summary:** End each detailed day with a summary in a blockquote format (>) with clear bullet points for key takeaways.',
          '11. **Visual Elements:** Use relevant emojis sparingly to enhance readability (🏛️ for museums, 🍝 for food, etc.).',
        ],
      },
      metadata: {
        description:
          "A JSON object containing the key data points from the user's request for easy parsing and display.",
        fields: {
          destination: 'String. The primary travel destination.',
          travelDates: 'Array of strings. The start and end date of the trip.',
          tripDuration: `Number. The calculated duration of the trip in days: ${tripDurationDays}.`,
          budget: "String. The user's provided budget level.",
          preferences: "Array of strings. The list of the user's stated interests.",
          articleTitle: 'String. The engaging title generated for the Markdown article.',
          slug: 'String. A URL-friendly version of the title, e.g., "paris-culture-food-5-day-trip"',
          detailNote:
            "String. A note on the chosen detail strategy, e.g., 'full_detailed', 'first_week_detailed', 'thematic_overview'.",
        },
      },
    },
    user_preferences: {
      Destination: `${params.destination}`,
      'Travel Dates': `${params.travelDates.join(' to ')}`,
      'Trip Duration (days)': tripDurationDays,
      Budget: `${params.budget}`,
      Preferences: `${params.preferences.join(', ')}`,
    },
    maps_note:
      "IMPORTANT: Include Google Maps links for all places using the format: [Place Name](https://www.google.com/maps/search/?api=1&query=Place+Name,City+Name). Replace spaces with '+' in the URL.",
  });
}
