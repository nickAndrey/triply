import { getSuggestions } from './_actions/get-suggestions';
import { GenerateSuggestionsCard } from './_components/generate-suggestions-form/generate-suggestions-card';
import { SuggestionItem } from './_components/suggestion-item';
import { Suggestions } from './_components/suggestions';

export default async function HomePage() {
  const suggestions = await getSuggestions();

  return (
    <main className="flex flex-col gap-6 min-h-[100dvh] max-w-6xl m-auto px-4 py-5">
      {suggestions.length > 0 ? (
        <Suggestions suggestions={suggestions} />
      ) : (
        <SuggestionItem suggestion={null} />
      )}

      <GenerateSuggestionsCard />
    </main>
  );
}
