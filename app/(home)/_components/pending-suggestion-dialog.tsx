'use client';

import { useRequest } from '@/app/_providers/request-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/chadcn/components/ui/dialog';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function PendingSuggestionDialog() {
  const { isPending } = useRequest();

  const [isOpen, setIsOpen] = useState(false);
  const [facts, setFacts] = useState<{ markdownContent: string }[] | null>(
    null
  );

  useEffect(() => setIsOpen(isPending), [isPending]);

  // useEffect(() => {
  //   getCountryFacts().then((data: { markdownContent: string }) => {
  //     setFacts([{ markdownContent: data.markdownContent }]);
  //   });
  // }, [isPending]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Generating your travel suggestion
            {isPending && (
              <LoaderCircle
                className="animate-spin"
                width={16}
                height={16}
              />
            )}
          </DialogTitle>
          <DialogDescription>
            This may take a moment. In the meantime, check out some travel
            articles for tips and inspiration.
          </DialogDescription>
        </DialogHeader>

        {facts &&
          facts.map((fact, idx) => (
            <Markdown remarkPlugins={[remarkGfm]} key={idx}>
              {fact.markdownContent}
            </Markdown>
          ))}
      </DialogContent>
    </Dialog>
  );
}
