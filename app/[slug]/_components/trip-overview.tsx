import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';

import { buildGoogleMapsLink } from '../_utils/build-google-maps-link';

type Props = {
  itinerary: TravelItineraryRow;
};

export function TripOverview({ itinerary }: Props) {
  const asideContent = itinerary.trip_days.map((day) => ({
    anchor: day.dayNumber,
    title: `Day ${day.dayNumber}: ${day.theme}`,
    places: [...day.morning.map((m) => m.name), ...day.afternoon.map((a) => a.name), ...day.evening.map((e) => e.name)],
  }));

  return (
    <aside className="rounded-2xl bg-card p-4 shadow-md border-1">
      <h2 className="text-lg font-semibold !my-3">Trip Overview</h2>

      <nav className="space-y-3">
        {asideContent.map((day, idx) => (
          <details key={day.anchor} open={idx === 0} className="rounded-lg bg-accent/20 hover:bg-accent/50 transition">
            <summary className="cursor-pointer px-3 py-2 font-medium">
              <a href={`#${day.anchor}`} className="no-underline hover:underline text-sm">
                {day.title}
              </a>
            </summary>

            <ul className="px-4 pb-2 text-sm space-y-1 list-disc list-inside">
              {day.places.map((place, idx_2) => (
                <li key={idx_2}>
                  <a
                    href={buildGoogleMapsLink({
                      place,
                      city: itinerary.trip_core.city,
                      country: itinerary.trip_core.country,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>{place}</strong>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </nav>
    </aside>
  );
}
