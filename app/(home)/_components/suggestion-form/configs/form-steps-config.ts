export const formStepsConfig = [
  {
    label: 'Step 1 — Destination',
    title: 'Plan Your Next Adventure',
    description: 'Tell us what you’re looking for and we’ll suggest trips tailored for you.',
    fields: {
      destination: {
        label: '✈️ Where does your next adventure begin?',
        placeholder: 'Enter a city or country...',
        description: 'Type a destination you would like to visit — a city, country, or even a region.',
      },
    },
  },
  {
    label: 'Step 2 — Travel Dates',
    title: '📅 When are you traveling?',
    description: 'Just tell us how many days and we’ll suggest the best windows.',
    fields: {
      tripDurationDays: {
        label: 'Trip Duration',
        placeholder: 'Set travel duration in days',
        description: 'How many days do you want your journey to last?',
      },
      season: {
        label: 'Preferred Season',
        description:
          'Choose the season that best matches your travel plans or mood. This helps us match activities and vibes.',
      },
    },
  },
  {
    label: 'Step 3 — Who’s Coming Along?',
    title: '👥 Who are you traveling with?',
    description: 'Solo? Couple? Family or friends? This helps us tailor activities, pacing, and practical details.',
    fields: {
      companions: {
        label: 'Companions',
        description: 'Select who’s joining you so we can adjust activities and recommendations accordingly.',
      },
      groupSize: {
        label: 'Group Size',
        placeholder: 'Set amount of people in a group',
        description:
          'For families or friend groups, let us know how many people are coming along to adjust comfort and logistics.',
      },
    },
  },
  {
    label: 'Step 4 — Vibe & Tempo',
    title: '🎵 What’s the vibe of your trip?',
    description: 'Choose your ideal atmosphere and pace — this shapes how many activities we’ll plan per day.',
    fields: {
      tripVibe: {
        label: 'Trip Vibe',
        description: 'Do you want a beach escape, a city adventure, or a nature retreat?',
      },
      pace: {
        label: 'Trip Pace',
        description: 'Decide how fast or slow you’d like to move through your days.',
      },
      activityIntensity: {
        label: 'Activity Intensity',
        description: 'How physically active should your trip be? Gentle, balanced, or full of energy?',
      },
      planningStyle: {
        label: 'Planning Style',
        description: 'Do you prefer detailed schedules, a loose outline, or pure spontaneity?',
      },
    },
  },
  {
    label: 'Step 5 — Food & Tastes',
    title: '🍴 What are your must-haves?',
    description:
      'Tell us what you love (and how adventurous you are with food). This sets the highlights and priorities of your trip.',
    fields: {
      foodPreferences: {
        label: 'Food Preferences',
        description:
          'Select the dining styles and food experiences that excite you most — from street food to fine dining.',
      },
      foodRestrictions: {
        label: 'Food Restrictions',
        placeholder: 'List allergies, foods you dislike, or things you want to avoid',
        description: 'Let us know about dietary needs or dislikes so we can fine-tune your dining recommendations.',
      },
    },
  },
  {
    label: 'Step 6 — Budget & Boundaries',
    title: '💰 Budget & boundaries',
    description:
      'Are you traveling on a budget, looking for balance, or going premium? Add must-sees, things to avoid, and dietary needs so we get it right.',
    fields: {
      budget: {
        label: 'Budget Level',
        description: 'Choose how you’d like to balance comfort and cost for your trip.',
      },
      placesToSee: {
        label: 'Must-See Places',
        placeholder: 'e.g. Eiffel Tower, Tokyo Skytree, local markets, hiking trails',
        description: 'List landmarks, attractions, or types of places you’d really love to include.',
      },
      placesAvoidToSee: {
        label: 'Places to Skip',
        placeholder: 'e.g. crowded tourist traps, busy nightlife areas, museums, theme parks',
        description: 'Tell us what you’d prefer to avoid so your trip matches your vibe.',
      },
    },
  },
  {
    label: 'Step 7 — Personal Touch',
    title: '✨ Personal Context — Make It Truly Yours',
    description:
      'Describe what success means for this trip and your perfect day. These details make our recommendations deeply personal.',
    fields: {
      tripSuccessDefinition: {
        label: 'This trip will be successful if…',
        placeholder:
          'e.g. I get to relax without worrying about work, spend quality time with my kids, and try authentic local food.',
        description:
          'Define what a ‘successful trip’ means for you — relaxation, bonding, adventure, or something else.',
      },
      perfectDay: {
        label: 'Your Perfect Vacation Day',
        placeholder:
          'e.g. A slow morning with coffee by the beach, exploring a hidden town in the afternoon, and ending the day with sunset and live music.',
        description: 'Paint a picture of your dream day on vacation — it helps us fine-tune the rhythm and activities.',
      },
    },
  },
] as const;
