import { DB_TABLES } from '@/app/_constants/db-tables';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function TravelSuggestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: suggestion } = await supabase
    .from(DB_TABLES.personal_travel_suggestions)
    .select('*')
    .eq('user_id', user.id)
    .eq('slug', slug)
    .single();

  if (!suggestion) {
    return notFound();
  }

  return (
    <main className="flex flex-col gap-6 min-h-[100dvh] max-w-4xl m-auto px-4 py-5">
      <article className="prose dark:prose-invert max-w-none">
        <Markdown remarkPlugins={[remarkGfm]}>
          {suggestion.markdown_content}
        </Markdown>
      </article>
    </main>
  );
}
