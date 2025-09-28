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

/**
 * 
 * Output:
 * 
 * suggestions: [
  {
    country: 'France',
    city: 'Paris',
    title: 'Paris, France',
    description: 'The City of Light dazzles with iconic landmarks like the Eiffel Tower and world-class art at the Louvre. Stroll along the Seine and indulge in exquisite French cuisine at charming sidewalk cafes.'
  },
  {
    country: 'Spain',
    city: 'Barcelona',
    title: 'Barcelona, Spain',
    description: "Gaudi's architectural masterpieces meet vibrant Mediterranean beaches in this Catalan capital. Explore the whimsical Park Güell and savor tapas in the lively Gothic Quarter."
  },
  {
    country: 'United States',
    city: 'Grand Canyon',
    title: 'Grand Canyon, United States',
    description: "Marvel at one of the world's most spectacular natural wonders with its breathtaking layered rock formations. Hike the rim trails or take a helicopter tour for unforgettable panoramic views."
  },
  {
    country: 'Turkey',
    city: 'Istanbul',
    title: 'Istanbul, Turkey',
    description: 'Where East meets West across the Bosphorus Strait, this ancient city boasts the magnificent Hagia Sophia and bustling Grand Bazaar. Experience the call to prayer echoing between minarets and mosques.'
  },
  {
    country: 'Italy',
    city: 'Rome',
    title: 'Rome, Italy',
    description: "The Eternal City offers an open-air museum of ancient history from the Colosseum to the Roman Forum. Toss a coin in the Trevi Fountain and enjoy authentic pasta in Trastevere's cobblestone streets."
  },
  {
    country: 'Mexico',
    city: 'Cancun',
    title: 'Cancun, Mexico',
    description: 'Turquoise Caribbean waters meet powdery white sand beaches in this tropical paradise. Explore ancient Mayan ruins at nearby Tulum or enjoy world-class resorts and vibrant nightlife.'
  },
  {
    country: 'Germany',
    city: 'Berlin',
    title: 'Berlin, Germany',
    description: "A city of contrasts where Cold War history meets cutting-edge contemporary culture. See the remaining Berlin Wall sections and experience the city's legendary nightlife and art scene."
  },
  {
    country: 'Japan',
    city: 'Tokyo',
    title: 'Tokyo, Japan',
    description: 'Experience the perfect blend of traditional temples and ultra-modern neon-lit districts in this electrifying metropolis. From serene gardens to the bustling Shibuya Crossing, Tokyo never fails to amaze.'
  },
  {
    country: 'Greece',
    city: 'Santorini',
    title: 'Santorini, Greece',
    description: 'Whitewashed villages cling to dramatic cliffs overlooking the deep blue Aegean Sea. Watch spectacular sunsets from Oia and swim in the volcanic hot springs of this iconic Greek island.'
  },
  {
    country: 'Thailand',
    city: 'Bangkok',
    title: 'Bangkok, Thailand',
    description: "A vibrant city of golden temples, floating markets, and incredible street food that tantalizes the senses. Explore the Grand Palace's intricate architecture and experience the city's energetic night markets."
  }
]
 */

/**
 *
 * [
    {
        "id": "6dc65043-3131-4388-9bf1-992adaca4829",
        "country": "France",
        "city": "Paris",
        "title": "Paris, France",
        "description": "The City of Light dazzles with iconic landmarks like the Eiffel Tower and Louvre Museum. Stroll along the Seine and indulge in world-class cuisine at charming sidewalk cafes.",
        "photos": [
            {
                "id": "R5scocnOOdM",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxQYXJpc3xlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxQYXJpc3xlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxQYXJpc3xlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxQYXJpc3xlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxQYXJpc3xlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1499856871958-5b9627545d1a"
                },
                "unsplash_url": "https://unsplash.com/photos/bridge-during-night-time-R5scocnOOdM",
                "photographer_name": "Léonard Cotte",
                "photographer_url": "https://unsplash.com/@ettocl",
                "photographer_profile_image": "https://images.unsplash.com/profile-1545973666179-c5ad6746ba37?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    },
    {
        "id": "bcc69ed8-a3d6-40c4-ba6a-b249ef978c9c",
        "country": "Spain",
        "city": "Barcelona",
        "title": "Barcelona, Spain",
        "description": "Gaudi's architectural masterpieces meet vibrant Mediterranean beaches in this cosmopolitan city. Explore the Gothic Quarter and savor tapas in bustling plazas.",
        "photos": [
            {
                "id": "hVhfqhDYciU",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1583422409516-2895a77efded?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmF8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1583422409516-2895a77efded?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmF8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1583422409516-2895a77efded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmF8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1583422409516-2895a77efded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmF8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1583422409516-2895a77efded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmF8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1583422409516-2895a77efded"
                },
                "unsplash_url": "https://unsplash.com/photos/aerial-view-of-city-buildings-during-daytime-hVhfqhDYciU",
                "photographer_name": "Logan Armstrong",
                "photographer_url": "https://unsplash.com/@loganstrongarms",
                "photographer_profile_image": "https://images.unsplash.com/profile-fb-1539183540-e03f06db26c7.jpg?ixlib=rb-4.1.0&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    },
    {
        "id": "e270e0e8-8891-4249-b952-fbdbe8e79180",
        "country": "United States",
        "city": "Grand Canyon",
        "title": "Grand Canyon, United States",
        "description": "Marvel at one of the world's most spectacular natural wonders with its breathtaking layered rock formations. Hike the rim trails for unforgettable sunset views.",
        "photos": [
            {
                "id": "ZZnH4GOzDgc",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxHcmFuZCUyMENhbnlvbnxlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxHcmFuZCUyMENhbnlvbnxlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxHcmFuZCUyMENhbnlvbnxlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxHcmFuZCUyMENhbnlvbnxlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxHcmFuZCUyMENhbnlvbnxlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1615551043360-33de8b5f410c"
                },
                "unsplash_url": "https://unsplash.com/photos/brown-rocky-mountain-under-white-clouds-during-daytime-ZZnH4GOzDgc",
                "photographer_name": "Omer Nezih Gerek",
                "photographer_url": "https://unsplash.com/@ongerek",
                "photographer_profile_image": "https://images.unsplash.com/profile-1680091026773-25095cca8347image?ixlib=rb-4.1.0&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    },
    {
        "id": "5953e70d-fa69-4dcc-8cab-b4ef9a64cd08",
        "country": "Turkey",
        "city": "Istanbul",
        "title": "Istanbul, Turkey",
        "description": "Where East meets West in a city spanning two continents, featuring the magnificent Hagia Sophia and Blue Mosque. Wander through the Grand Bazaar's labyrinthine alleys.",
        "photos": [
            {
                "id": "0n0AHB1fgTQ",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxJc3RhbmJ1bHxlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxJc3RhbmJ1bHxlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxJc3RhbmJ1bHxlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxJc3RhbmJ1bHxlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxJc3RhbmJ1bHxlbnwwfDB8fHwxNzU5MDkzMTUyfDA&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1524231757912-21f4fe3a7200"
                },
                "unsplash_url": "https://unsplash.com/photos/aerial-view-of-buildings-and-flying-birds-0n0AHB1fgTQ",
                "photographer_name": "Anna Berdnik",
                "photographer_url": "https://unsplash.com/@berdnika",
                "photographer_profile_image": "https://images.unsplash.com/profile-fb-1524230440-32eeec06d3ea.jpg?ixlib=rb-4.1.0&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    },
    {
        "id": "b7502e4e-b92d-4d35-a9da-413c24f0d9c6",
        "country": "Italy",
        "city": "Rome",
        "title": "Rome, Italy",
        "description": "The Eternal City offers ancient wonders like the Colosseum and Roman Forum alongside Renaissance art and delicious pasta. Toss a coin in the Trevi Fountain for good luck.",
        "photos": [
            {
                "id": "VFRTXGw1VjU",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxSb21lfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxSb21lfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxSb21lfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxSb21lfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxSb21lfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1552832230-c0197dd311b5"
                },
                "unsplash_url": "https://unsplash.com/photos/colosseum-arena-photography-VFRTXGw1VjU",
                "photographer_name": "David Köhler",
                "photographer_url": "https://unsplash.com/@davidkhlr",
                "photographer_profile_image": "https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    },
    {
        "id": "c2444a2e-fcf4-4aab-8ca4-c3e035d89a07",
        "country": "Mexico",
        "city": "Cancun",
        "title": "Cancun, Mexico",
        "description": "Pristine white-sand beaches meet turquoise Caribbean waters in this tropical paradise. Explore ancient Mayan ruins and vibrant nightlife along the Hotel Zone.",
        "photos": [
            {
                "id": "PW3tJkRkSy8",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxDYW5jdW58ZW58MHwwfHx8MTc1OTA5MzE1Mnww&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxDYW5jdW58ZW58MHwwfHx8MTc1OTA5MzE1Mnww&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxDYW5jdW58ZW58MHwwfHx8MTc1OTA5MzE1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxDYW5jdW58ZW58MHwwfHx8MTc1OTA5MzE1Mnww&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxDYW5jdW58ZW58MHwwfHx8MTc1OTA5MzE1Mnww&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1510097467424-192d713fd8b2"
                },
                "unsplash_url": "https://unsplash.com/photos/aerial-photo-of-white-buildings-PW3tJkRkSy8",
                "photographer_name": "Gerson Repreza",
                "photographer_url": "https://unsplash.com/@gersonrepreza",
                "photographer_profile_image": "https://images.unsplash.com/profile-fb-1505923522-80c8e93c6807.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    },
    {
        "id": "005d7a32-4312-4352-85f6-4a418bedc2d2",
        "country": "Germany",
        "city": "Berlin",
        "title": "Berlin, Germany",
        "description": "A dynamic capital where history meets cutting-edge culture, from the Brandenburg Gate to vibrant street art. Experience world-class museums and eclectic nightlife.",
        "photos": [
            {
                "id": "1uWanmgkd5g",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCZXJsaW58ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCZXJsaW58ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCZXJsaW58ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCZXJsaW58ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCZXJsaW58ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1599946347371-68eb71b16afc"
                },
                "unsplash_url": "https://unsplash.com/photos/city-buildings-near-body-of-water-during-daytime-1uWanmgkd5g",
                "photographer_name": "Florian Wehde",
                "photographer_url": "https://unsplash.com/@florianwehde",
                "photographer_profile_image": "https://images.unsplash.com/profile-1599508238258-012a49f04884image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    },
    {
        "id": "b7aeb956-f52e-426a-ba7c-b5f60c938917",
        "country": "Japan",
        "city": "Kyoto",
        "title": "Kyoto, Japan",
        "description": "Discover Japan's cultural heart with thousands of temples, serene Zen gardens, and traditional geisha districts. Witness stunning cherry blossoms in spring.",
        "photos": [
            {
                "id": "_UIN-pFfJ7c",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxLeW90b3xlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxLeW90b3xlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxLeW90b3xlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxLeW90b3xlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxLeW90b3xlbnwwfDB8fHwxNzU5MDkzMTU2fDA&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1493976040374-85c8e12f0c0e"
                },
                "unsplash_url": "https://unsplash.com/photos/two-women-in-purple-and-pink-kimono-standing-on-street-_UIN-pFfJ7c",
                "photographer_name": "Sorasak",
                "photographer_url": "https://unsplash.com/@boontohhgraphy",
                "photographer_profile_image": "https://images.unsplash.com/profile-fb-1465873650-f0493ea24e77.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    },
    {
        "id": "74a61082-9880-4544-982f-50e74758e870",
        "country": "Greece",
        "city": "Santorini",
        "title": "Santorini, Greece",
        "description": "Whitewashed villages cling to dramatic cliffs above the deep blue Aegean Sea. Watch spectacular sunsets from Oia and swim in volcanic hot springs.",
        "photos": [
            {
                "id": "kYxgm42SQso",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxTYW50b3Jpbml8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxTYW50b3Jpbml8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxTYW50b3Jpbml8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxTYW50b3Jpbml8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxTYW50b3Jpbml8ZW58MHwwfHx8MTc1OTA5MzE1MXww&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1570077188670-e3a8d69ac5ff"
                },
                "unsplash_url": "https://unsplash.com/photos/santorini-greece-kYxgm42SQso",
                "photographer_name": "Heidi Kaden",
                "photographer_url": "https://unsplash.com/@infinitexplorer",
                "photographer_profile_image": "https://images.unsplash.com/profile-1618902649659-eacbad541215image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    },
    {
        "id": "60ccec68-198c-417a-84be-97aff0549745",
        "country": "Thailand",
        "city": "Bangkok",
        "title": "Bangkok, Thailand",
        "description": "A bustling metropolis where golden temples and floating markets coexist with modern skyscrapers. Sample incredible street food and experience vibrant nightlife.",
        "photos": [
            {
                "id": "-y3sidWvDxg",
                "images": {
                    "raw": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYW5na29rfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0",
                    "full": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYW5na29rfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0&q=85",
                    "regular": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYW5na29rfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "small": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYW5na29rfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=400",
                    "thumb": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDEzMDF8MHwxfHNlYXJjaHwxfHxCYW5na29rfGVufDB8MHx8fDE3NTkwOTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=200",
                    "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1508009603885-50cf7c579365"
                },
                "unsplash_url": "https://unsplash.com/photos/two-auto-rickshaw-on-the-street--y3sidWvDxg",
                "photographer_name": "Florian Wehde",
                "photographer_url": "https://unsplash.com/@florianwehde",
                "photographer_profile_image": "https://images.unsplash.com/profile-1599508238258-012a49f04884image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128"
            }
        ]
    }
]
*/
