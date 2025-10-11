'use client';

import { useItineraryGenerationSubscriber } from '@providers/itinerary-generation-subscriber-context';

import { ScrollToTopButton } from '@components/scroll-to-top-button';
import { TravelLoader } from '@components/travel-loader';

import { ResizableLayer } from '@/app/[slug]/_components/resizable-layer';
import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';

import { buildGoogleMapsLink } from '../_utils/build-google-maps-link';
import { ItineraryActionsPanel } from './itineray-actions-panel/itinerary-actions-panel';
import { TripOverview } from './trip-overview';

type Props = {
  dbItinerary: TravelItineraryRow;
};

export function TripPlanView({ dbItinerary }: Props) {
  const { itinerary } = useItineraryGenerationSubscriber();

  const itineraryDataSrc = itinerary ? itinerary : dbItinerary;

  const { trip_core, trip_days, trip_status } = itineraryDataSrc;

  const isLive = trip_status !== 'completed' && trip_status !== 'failed';

  return (
    <main className="prose dark:prose-invert min-w-[100dvw] xl:min-w-[90dvw] xl:m-auto">
      <ResizableLayer aside={<TripOverview itinerary={itineraryDataSrc} />}>
        <article className="h-full overflow-y-auto px-4 py-4">
          <h1>{trip_core.articleTitle}</h1>
          <h3>{trip_core.tripSummary}</h3>

          <ItineraryActionsPanel itinerary={itineraryDataSrc} />
          <ScrollToTopButton />

          {trip_days.map((day) => (
            <section key={day.dayNumber}>
              <header>
                <h2 id={day.dayNumber.toString()}>
                  Day {day.dayNumber}: {day.theme}
                </h2>
                <p>
                  <em>{day.summary}</em>
                </p>
              </header>

              <h3>Morning</h3>
              <ul>
                {day.morning.map((act, i) => (
                  <li key={i}>
                    <a
                      href={buildGoogleMapsLink({
                        place: act.name,
                        city: trip_core.city,
                        country: trip_core.country,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong>{act.name}</strong>
                    </a>
                    ({act.budget}) — {act.description}
                  </li>
                ))}
              </ul>

              <h3>Afternoon</h3>
              <ul>
                {day.afternoon.map((act, i) => (
                  <li key={i}>
                    <a
                      href={buildGoogleMapsLink({
                        place: act.name,
                        city: trip_core.city,
                        country: trip_core.country,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong>{act.name}</strong>
                    </a>
                    ({act.budget}) — {act.description}
                  </li>
                ))}
              </ul>

              <h3>Evening</h3>
              <ul>
                {day.evening.map((act, i) => (
                  <li key={i}>
                    <a
                      href={buildGoogleMapsLink({
                        place: act.name,
                        city: trip_core.city,
                        country: trip_core.country,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong>{act.name}</strong>
                    </a>
                    ({act.budget}) — {act.description}
                  </li>
                ))}
              </ul>

              <aside>
                <h4>Insider Tips</h4>
                <ul>
                  {day.insiderTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
                <p>
                  <strong>Hidden Gem:</strong> {day.hiddenGem}
                </p>
              </aside>
            </section>
          ))}

          {isLive ? (
            <div className="flex items-center gap-2 border border-primary/20 bg-primary/5 p-2 rounded-2xl">
              <TravelLoader size={100} />
              <div className="flex flex-col gap-1">
                <p className="text-primary font-medium !my-0">Your adventure is still unfolding...</p>
                <p className="text-sm text-muted-foreground !my-0">
                  New days are being added in real time — stay tuned as your journey takes shape!
                </p>
              </div>
            </div>
          ) : (
            <section className="mt-10 space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Conclusion</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{trip_core.tripConclusion}</p>
            </section>
          )}
        </article>
      </ResizableLayer>
    </main>
  );
}
