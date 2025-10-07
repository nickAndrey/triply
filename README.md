# 🌍 AI Travel Planner – Your Smart Travel Companion

Tired of endless searching, planning, and second-guessing your next trip? **AI Travel Planner** takes the stress out of organizing adventures by turning your preferences into a beautifully detailed, day-by-day travel guide.

---

## ✨ How It Works

1. **Quick Sign-In** Log in securely to start planning your personalized journey.
2. **Smart Suggestions** Not sure where to go? The app suggests trending and seasonal destinations like Rome, Bali, or Paris, complete with stunning images to inspire you.
3. **Plan Your Way** Fill out a simple form with:
4. ✈️ Destination (choose or type your own)
5. 📅 Travel Dates
6. 💸 Budget (Low / Medium / High)
7. 🎯 Preferences (Culture, Beaches, Food, Nature, Nightlife, Family, Solo)
8. **AI-Powered Itinerary** In seconds, you’ll receive a **personalized travel plan** that feels like it was written by your own tour guide:
9. A catchy trip title
10. Day-by-day breakdowns (morning, afternoon, evening)
11. Local history, cultural context, and dining recommendations
12. Practical details (opening hours, costs, transport times)
13. Daily highlights, hidden gems, and flexible options
14. **Save & Explore**Every plan is saved to your account. Browse them anytime from your personal dashboard, or dive deeper into each trip on its own dedicated page.

---

## 🖥️ Features Users Will Love

- **AI-Generated Inspiration** → discover new destinations that fit your season, location, and style.
- **Effortless Trip Planning** → from weekend escapes to multi-day adventures.
- **Beautiful Travel Guides** → presented in a blog-style format that’s easy to read and share.
- **Organized Dashboard** → keep all your saved trips in one place.
- **Flexible & Personalized** → adapt your plans to families, solo travelers, or cultural explorers.

---

## 🌟 Why Choose AI Travel Planner?

Unlike generic trip apps, this planner doesn’t just list attractions — it **weaves together stories, tips, and local flavor** to make your journey unforgettable. Whether you want to explore ancient ruins, lounge on a beach, or eat your way through a city, your trip plan will feel curated just for you.

# 🧭 Progressive Itinerary Generation Flow

This document explains the **end-to-end architecture** of the progressive itinerary generation system.

---

## 📡 High-Level Flow of generating suggestion

```
[ Client (UI) ]
      |
      | POST /startItinerary
      v
[ Next.js Server Action ]
      |
      | 1. insert trip(status="in_progress")
      | 2. return tripId
      v
[ Supabase DB ]
      ^
      |
      | trigger background worker (/api/generate-itinerary?tripId=...)
      v
[ Background Generator ]
      | loop days:
      |   - generate day
      |   - update DB (append new day JSON)
      |   - mark status ("completed" when finished)
      v
[ Supabase DB ] -- realtime --> [ Client subscribed to tripId ]
```
