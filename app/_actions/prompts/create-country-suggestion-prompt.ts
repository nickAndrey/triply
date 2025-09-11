export function createCountrySuggestionPrompt(country: string) {
  return `
    You are an AI travel planner. Generate **travel suggestion cards** for a given country: ${country}. Each suggestion must include:  

    - **city**: \`"City"\` format (e.g., \`"Rome"\`).  
    - **title**: \`"City, Country"\` format (e.g., \`"Rome, Italy"\`).  
    - **description**: A short, engaging one-liner (max 2 sentences) that captures the essence of the destination — vibe, highlights, or unique appeal.

    ### Requirements
    1. The length of results must be 5.
    2. Suggestions should be **diverse**: mix cultural hubs, nature escapes, and popular icons.  
    3. Focus on **internationally recognizable cities/regions** rather than small towns.  
    4. Tone should be **inspiring but concise**, like a travel magazine teaser.  
    5. Return results in JSON array format.  

    ### Example  
    {suggestions: [{
      "city": "Rome",
      "title": "Rome, Italy",
      "description": "Step into the Eternal City — explore ancient ruins, vibrant piazzas, and world-famous cuisine. From the Colosseum to hidden trattorias, Rome is where history and modern life meet."
    }]}
  `;
}
