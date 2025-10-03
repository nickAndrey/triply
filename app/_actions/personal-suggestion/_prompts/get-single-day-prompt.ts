import { SuggestionFormFields } from '@/app/_actions/personal-suggestion/_types/form';

export function getSingleDayPrompt(form: SuggestionFormFields) {
  const isFirstDay = form.currentDay === 1;
  const tripDurationDays = Number(form.tripDurationDays);
  const destinationCity = form.destination.split(',')[0];

  const articleTitle = `[Generate a warm, inviting ${tripDurationDays}-day ${form.tripVibe.toLowerCase()} itinerary title for ${form.companions.toLowerCase()} in ${destinationCity}]`;
  const slug = `${tripDurationDays}-day-${form.companions.toLowerCase().replace(/\s+/g, '-')}-${form.tripVibe.toLowerCase()}-${destinationCity.toLowerCase().replace(/\s+/g, '-')}`;

  let companionContext = form.companions;
  if (form.friends?.length) {
    const count = form.friends.length;
    companionContext += count === 1 ? ` with 1 friend` : ` with ${count} friends`;
  }
  if (form.adults?.length) {
    const count = form.adults.length;
    companionContext += count === 1 ? ` and 1 other adult` : ` and ${count - 1} other adults`;
  }
  if (form.children && form.children.length > 0) {
    const childCount = form.children.reduce((sum, child) => sum + child.child, 0);
    companionContext += childCount === 1 ? ` with 1 child` : ` with ${childCount} children`;
  }

  const getActivityCount = (timeBlock: string) => {
    switch (form.activityIntensity) {
      case 'Sedentary':
        return 2;
      case 'Light':
        return timeBlock === 'Morning' ? 3 : 3;
      case 'Moderate':
        return timeBlock === 'Morning' ? 3 : 4;
      case 'High':
        return timeBlock === 'Morning' ? 4 : 4;
      case 'Extreme':
        return timeBlock === 'Morning' ? 4 : 5;
      default:
        return 3;
    }
  };

  const generateActivityLines = (timeBlock: string, count: number) => {
    return Array.from(
      { length: count },
      (_, i) =>
        `- **[Venue Name](https://maps.google.com/...)** $${i === count - 1 && timeBlock === 'Evening' ? '$$' : '$'} - [Vivid description matching ${form.activityIntensity.toLowerCase()} activity level]`
    ).join('\n');
  };

  const morningActivities = generateActivityLines('Morning', getActivityCount('Morning'));
  const afternoonActivities = generateActivityLines('Afternoon', getActivityCount('Afternoon'));
  const eveningActivities = generateActivityLines('Evening', getActivityCount('Evening'));

  const showHours = form.planningStyle === 'Hour-by-Hour';

  const markdownTemplate = isFirstDay
    ? `
      # ${articleTitle}

      ## Day ${form.currentDay}: [Creative Theme Title]

      As the [time of day] light touches [destination landmark], you'll discover [emotional hook about the day's theme]. [Continue with 1-2 paragraphs setting the mood and building anticipation - mention the ${form.activityIntensity.toLowerCase()} pace suitable for ${companionContext}].

      ### Morning ${showHours && '(8:00 AM - 12:00 PM)'}
      ${morningActivities}

      ### Afternoon ${showHours && '(12:00 PM - 5:00 PM)'}
      ${afternoonActivities}

      ### Evening ${showHours && '(5:00 PM - 9:00 PM)'}
      ${eveningActivities}

      ### Insider Tips
      - [Genuine local secret or timing advice]
      - [Practical tip for ${form.companions} with ${form.activityIntensity.toLowerCase()} activity level]
      - [Hidden gem or crowd-avoidance strategy]
    `
    : `
      ## Day ${form.currentDay}: [Creative Theme Title]

      Having explored [yesterday's highlights], today let's discover [new area/theme] where [emotional hook about today's experiences]. [Continue with 1-2 paragraphs building excitement while maintaining the perfect ${form.activityIntensity.toLowerCase()} pace for ${companionContext}].

      ### Morning ${showHours && '(8:00 AM - 12:00 PM)'}
      ${morningActivities}

      ### Afternoon ${showHours && '(12:00 PM - 5:00 PM)'}
      ${afternoonActivities}

      ### Evening ${showHours && '(5:00 PM - 9:00 PM)'}
      ${eveningActivities}

      ### Insider Tips
      - [Genuine local secret or timing advice]
      - [Practical tip for ${form.companions} with ${form.activityIntensity.toLowerCase()} activity level]
      - [Hidden gem or crowd-avoidance strategy]
    `;

  return `
    You are a passionate travel expert creating detailed itineraries. Create Day ${form.currentDay} and respond with JSON:

    {
      "markdownContent": ${JSON.stringify(markdownTemplate)},
      "metadata": {
        "dayNumber": ${form.currentDay},
        "destination": "${form.destination}",
        "travelDates": ["${form.season}"],
        "tripDuration": ${tripDurationDays},
        "budget": "${form.budget}",
        "tripVibe": "${form.tripVibe}",
        "companions": "${companionContext}",
        "pace": "${form.pace}",
        "planningStyle": "${form.planningStyle}",
        "foodAdventure": "${form.foodPreferences.join(',')}",
        "activityIntensity": "${form.activityIntensity}",
        "season": "${form.season}",
        "articleTitle": "${articleTitle}",
        "slug": "${slug}",
        "visitedPlaces": ["list", "actual", "places", "used", "in", "this", "day"],
        "themesUsed": ["theme1", "theme2", "theme3"],
        "daySummary": "1-2 sentence essence capturing the day's emotional core and ${form.activityIntensity.toLowerCase()} activity level"
      }
    }

    CRITICAL RULES:
    • ARTICLE TITLE: Generate a warm, inviting title like "Romantic Barcelona Escape: 4 Days of Magic for Couples" or "Family Adventures in Barcelona: 5 Days of Catalan Wonders" - NOT formulaic like "4-Day Couple City in Barcelona"
    • SUBSEQUENT DAY INTRO: Use natural phrasing like "Having explored [yesterday's highlights], today let's discover [new area]" - NOT the awkward "After yesterday's... today we dive into..."
    • Activity intensity: ${form.activityIntensity} (${getActivityCount('Morning')} morning, ${getActivityCount('Afternoon')} afternoon, ${getActivityCount('Evening')} evening activities)
    • EVERY place must have Google Maps link and budget symbol
    • CHECK EVERY place which has Google Maps link to be formatted correctly
    • Write 1-2 paragraph emotional introduction after day header
    • Use bullet points ONLY in activity sections
    • 2-3 concise, vivid sentences per activity
    • NO repeating places or themes from previous days
    • Focus on why each experience is perfect for ${companionContext} with ${form.activityIntensity.toLowerCase()} activity level

    TRAVELER CONTEXT:
    • ${form.tripVibe} vibe • ${form.pace} pace • ${form.budget} budget
    • ${form.activityIntensity} activity level • ${form.season} season
    • Food: ${form.foodPreferences.join(', ')}
    • Food Restrictions: ${form.foodRestrictions}
    • Must see: ${form.placesToSee || 'no specific requests'}
    • Avoid: ${form.placesAvoidToSee || 'nothing'}

    Create authentic ${destinationCity} experiences for ${companionContext} with ${form.activityIntensity.toLowerCase()} activity level.
  `;
}
