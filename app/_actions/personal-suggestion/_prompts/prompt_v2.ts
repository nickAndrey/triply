import { SuggestionFormFields } from '@/app/_actions/personal-suggestion/_types/form';

// --------- Rules Matrix (pace × intensity) ----------
function getActivityCounts(pace: SuggestionFormFields['pace'], intensity: SuggestionFormFields['activityIntensity']) {
  const matrix: Record<string, Record<string, [number, number, number]>> = {
    Slow: {
      Sedentary: [1, 1, 1],
      Light: [2, 2, 2],
      High: [2, 2, 3],
    },
    Balanced: {
      Sedentary: [2, 2, 2],
      Light: [2, 3, 3],
      High: [3, 3, 3],
    },
    Fast: {
      Sedentary: [2, 3, 3],
      Light: [3, 3, 4],
      High: [3, 4, 4],
    },
  };

  // Safe lookup with fallback
  return matrix[pace]?.[intensity] || [2, 2, 2];
}

// --------- Companion Context Builder ----------
function formatCompanionContext(form: SuggestionFormFields): string {
  const companions = form.companions || 'Solo';

  switch (companions) {
    case 'Solo':
      return 'a solo traveler';
    case 'Couple':
      return 'a couple on a romantic trip';
    case 'Family': {
      const kids = form.children?.reduce((s, c) => s + (c.child || 0), 0) || 0;
      const adults = (form.adults?.length || 0) > 0 ? form.adults!.length : 2;
      return `a family of ${adults + kids} (${adults} adults and ${kids} children)`;
    }
    case 'Friends': {
      const count = (form.friends?.length || 0) > 0 ? form.friends!.length : 3;
      return `${count} friends traveling together`;
    }
    default:
      return companions;
  }
}

// --------- Robust Slug Generator ----------
function generateSlug(articleTitle: string): string {
  return articleTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .substring(0, 100);
}

// --------- Main Prompt Generator ----------
export function getSingleDayPrompt(form: SuggestionFormFields) {
  // Input validation
  if (!form.pace || !form.activityIntensity || !form.destination) {
    throw new Error('Missing required fields: pace, activityIntensity, destination');
  }

  const currentDay = Math.max(1, form.currentDay || 1);
  const isFirstDay = currentDay === 1;
  const tripDurationDays = Math.max(1, Number(form.tripDurationDays) || 3);
  const destinationCity = form.destination.split(',')[0];
  const companionContext = formatCompanionContext(form);
  const [morningCount, afternoonCount, eveningCount] = getActivityCounts(form.pace, form.activityIntensity);

  const articleTitle = `${tripDurationDays}-Day ${form.tripVibe || 'Memorable'} ${companionContext} in ${destinationCity}`;
  const slug = generateSlug(articleTitle);
  const showHours = form.planningStyle === 'Hour-by-Hour';

  const blockTime = {
    Morning: showHours ? '(8:00 AM - 12:00 PM)' : '',
    Afternoon: showHours ? '(12:00 PM - 5:00 PM)' : '',
    Evening: showHours ? '(5:00 PM - 9:00 PM)' : '',
  };

  const markdownTemplate = isFirstDay
    ? `
      # ${articleTitle}

      ## Day ${currentDay}: [Creative Theme Title]

      As the morning light touches ${destinationCity}, you'll begin your ${tripDurationDays}-day journey. Perfect for ${companionContext} seeking a ${form.activityIntensity.toLowerCase()} pace experience during ${form.season}.

      ### Morning ${blockTime.Morning}
      [${morningCount} vivid activities, at least 1 food stop if applicable]

      ### Afternoon ${blockTime.Afternoon}
      [${afternoonCount} vivid activities]

      ### Evening ${blockTime.Evening}
      [${eveningCount} vivid activities]

      ### Insider Tips
      - Local secret relevant to ${destinationCity}
      - Practical advice for ${companionContext}
      - Seasonal recommendation for ${form.season}
    `
    : `
      ## Day ${currentDay}: [Creative Theme Title]

      Continuing your exploration of ${destinationCity}, today offers new discoveries perfect for ${companionContext}. Maintain your ${form.activityIntensity.toLowerCase()} pace while experiencing the local culture.

      ### Morning ${blockTime.Morning}
      [${morningCount} vivid activities]

      ### Afternoon ${blockTime.Afternoon}
      [${afternoonCount} vivid activities]

      ### Evening ${blockTime.Evening}
      [${eveningCount} vivid activities]

      ### Insider Tips
      - Local secret relevant to today's activities
      - Practical advice for ${companionContext}
      - Hidden gem in ${destinationCity}
    `;

  return `
    You are a passionate travel expert creating detailed itineraries. Create Day ${currentDay} and respond ONLY in valid JSON:

    {
      "markdownContent": ${JSON.stringify(markdownTemplate)},
      "metadata": {
        "dayNumber": ${currentDay},
        "destination": "${form.destination}",
        "travelDates": ["${form.season || 'not specified'}"],
        "tripDuration": ${tripDurationDays},
        "budget": "${form.budget || '$$'}",
        "tripVibe": "${form.tripVibe || 'adventure'}",
        "companions": "${companionContext}",
        "pace": "${form.pace}",
        "planningStyle": "${form.planningStyle || 'Flexible'}",
        "foodPreferences": "${form.foodPreferences.join(', ') || 'none'}",
        "foodRestrictions": "${form.foodRestrictions || 'none'}",
        "activityIntensity": "${form.activityIntensity}",
        "season": "${form.season || 'not specified'}",
        "articleTitle": "${articleTitle}",
        "slug": "${slug}",
        "placesMustSee": "${form.placesToSee || 'none'}",
        "placesAvoid": "${form.placesAvoidToSee || 'none'}",
        "visitedPlaces": ["must reflect actual places from activities"],
        "themesUsed": ["must reflect actual narrative themes"],
        "daySummary": "1-2 sentences capturing the experience for ${companionContext}",
        "successDefinition": "${form.tripSuccessDefinition || 'not specified'}",
        "perfectDay": "${form.perfectDay || 'not specified'}"
      }
    }

    CRITICAL RULES - STRICTLY ENFORCED:

    ### Output Requirements
    - Respond ONLY with valid JSON - no additional text, explanations, or markdown
    - JSON must parse without errors
    - All string values must be properly escaped

    ### Content Rules
    - NEVER include placeholders like [Generate...], [Creative Theme Title], or [time of day]
    - Replace ALL placeholders with actual content before final output
    - Activity counts must match: ${morningCount} morning, ${afternoonCount} afternoon, ${eveningCount} evening
    - Include real Google Maps links for each activity location
    - Food stops must align with: ${form.foodPreferences.join(', ') || 'none'}

    ### Metadata Accuracy
    - visitedPlaces: Array of actual place names mentioned in activities
    - themesUsed: Array of real narrative themes used in the day's content
    - daySummary: 1-2 complete sentences describing the day's experience
    - All metadata fields must contain real values, not instructions

    ### Validation
    - Test your JSON output with JSON.parse() before returning
    - Ensure all required fields are present and populated
    - Verify no instructional text remains in the final content
    - Make sure the slug matches the article title format: ${slug}
  `;
}
