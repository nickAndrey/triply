import { SuggestionFormFields } from '@/app/_actions/personal-suggestion/_types/form';

// --------- Rules Matrix (pace × intensity) ----------
function getActivityCounts(pace: SuggestionFormFields['pace'], intensity: SuggestionFormFields['activityIntensity']) {
  const matrix: Record<
    SuggestionFormFields['pace'],
    Record<SuggestionFormFields['activityIntensity'], [number, number, number]>
  > = {
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
  return matrix[pace][intensity]; // [morning, afternoon, evening]
}

// --------- Companion Context Builder ----------
function formatCompanionContext(form: SuggestionFormFields): string {
  switch (form.companions) {
    case 'Solo':
      return 'a solo traveler';
    case 'Couple':
      return 'a couple on a romantic trip';
    case 'Family': {
      const kids = form.children?.reduce((s, c) => s + c.child, 0) || 0;
      const adults = form.adults?.length || 2;
      return `a family of ${adults + kids} (${adults} adults and ${kids} children)`;
    }
    case 'Friends': {
      const count = form.friends?.length || 3;
      return `${count} friends traveling together`;
    }
    default:
      return form.companions;
  }
}

// --------- Prompt Generator ----------
export function getSingleDayPrompt(form: SuggestionFormFields) {
  const isFirstDay = form.currentDay === 1;
  const tripDurationDays = Number(form.tripDurationDays);
  const destinationCity = form.destination.split(',')[0];
  const companionContext = formatCompanionContext(form);

  const [morningCount, afternoonCount, eveningCount] = getActivityCounts(form.pace, form.activityIntensity);

  const articleTitle = `[Generate a warm, inviting ${tripDurationDays}-day ${form.tripVibe.toLowerCase()} itinerary title for ${companionContext} in ${destinationCity}]`;
  const slug = `${tripDurationDays}-day-${form.companions.toLowerCase()}-${form.tripVibe.toLowerCase()}-${destinationCity.toLowerCase().replace(/\s+/g, '-')}`;

  const showHours = form.planningStyle === 'Hour-by-Hour';

  // --------- Rules by Planning Style ----------
  const blockTime = {
    Morning: showHours ? '(8:00 AM - 12:00 PM)' : '',
    Afternoon: showHours ? '(12:00 PM - 5:00 PM)' : '',
    Evening: showHours ? '(5:00 PM - 9:00 PM)' : '',
  };

  // --------- Prompt Body ----------
  const markdownTemplate = isFirstDay
    ? `
      # ${articleTitle}

      ## Day ${form.currentDay}: [Creative Theme Title]

      As the [time of day] light touches ${destinationCity}, you'll discover [emotional hook]. [1–2 paragraphs about vibe, season, ${form.activityIntensity.toLowerCase()} pace, perfect for ${companionContext}].

      ### Morning ${blockTime.Morning}
      [${morningCount} vivid activities, at least 1 food stop if ${form.foodPreferences.join(', ')}]

      ### Afternoon ${blockTime.Afternoon}
      [${afternoonCount} vivid activities]

      ### Evening ${blockTime.Evening}
      [${eveningCount} vivid activities]

      ### Insider Tips
      - Local secret
      - Practical advice for ${companionContext}
      - Hidden gem
    `
    : `
      ## Day ${form.currentDay}: [Creative Theme Title]

      Having explored [yesterday’s highlights], today let's discover [new area/theme]. [1–2 paragraphs, natural continuation, aligned to ${form.activityIntensity.toLowerCase()} pace for ${companionContext}].

      ### Morning ${blockTime.Morning}
      [${morningCount} vivid activities]

      ### Afternoon ${blockTime.Afternoon}
      [${afternoonCount} vivid activities]

      ### Evening ${blockTime.Evening}
      [${eveningCount} vivid activities]

      ### Insider Tips
      - Local secret
      - Practical advice for ${companionContext}
      - Hidden gem
    `;

  // --------- Final Prompt ---------
  return `
    You are a passionate travel expert creating detailed itineraries. Create Day ${form.currentDay} and respond ONLY in valid JSON:

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
        "foodPreferences": "${form.foodPreferences.join(', ')}",
        "foodRestrictions": "${form.foodRestrictions || 'none'}",
        "activityIntensity": "${form.activityIntensity}",
        "season": "${form.season}",
        "articleTitle": "${articleTitle}",
        "slug": "${slug}",
        "placesMustSee": "${form.placesToSee || 'none'}",
        "placesAvoid": "${form.placesAvoidToSee || 'none'}",
        "visitedPlaces": ["list", "actual", "places", "used"],
        "themesUsed": ["theme1", "theme2"],
        "daySummary": "1-2 sentences capturing the emotional core and ${form.activityIntensity.toLowerCase()} pace",
        "successDefinition": "${form.tripSuccessDefinition || 'not specified'}",
        "perfectDay": "${form.perfectDay || 'not specified'}"
      }
    }

    CRITICAL RULES:
    • Titles → Warm & inviting, never formulaic. 
      - Do not output instructions or placeholders like [Generate...]. Always generate the final natural title.
    • Day theme titles (## Day X) → Replace [Creative Theme Title] with an actual evocative title.
    • Day intros → Natural, emotional, seasonal tone. Should not reuse the same template phrasing across days.
    • Activities →
      - ${morningCount}/${afternoonCount}/${eveningCount} vivid, sensory activities per block.
      - Each activity MUST be formatted as [PLACE NAME](https://www.google.com/maps/search/?api=1&query=PLACE+NAME+${destinationCity}).
      - Absolutely no placeholder names or links.
      - At least 1 dining activity per day that reflects "${form.foodPreferences.join(', ')}" and respects restrictions ("${form.foodRestrictions || 'none'}").
    • Must include: ${form.placesToSee || 'none'} (if not "none", it MUST appear as an activity).
    • Must avoid: ${form.placesAvoidToSee || 'none'} (if not "none", it MUST NOT appear in any activity).
    • Tone shaped by vibe: ${form.tripVibe}, season: ${form.season}, companions: ${companionContext}.
    • Insider Tips → Always specific to ${destinationCity}, season, and group type. No generic filler tips.
    • Output must be valid JSON, no extra commentary.
  `;
}
