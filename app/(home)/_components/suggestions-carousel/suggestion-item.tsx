import Image from 'next/image';

import { Ghost } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@chadcn/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@chadcn/components/ui/card';

import { Suggestion } from '@/app/_types/suggestion';

type SuggestionItemProps = {
  suggestion: Suggestion | null;
};

export function SuggestionItem({ suggestion }: SuggestionItemProps) {
  return (
    <Card className="px-0 py-3">
      <CardContent className="px-2">
        {!suggestion ? (
          <div className="flex flex-col items-center gap-3">
            <Ghost size={60} />
            <p className="text-gray-400 my-0">No data to show.</p>
          </div>
        ) : (
          <div className="relative aspect-[2/1] rounded-xl overflow-hidden">
            <Image
              src={suggestion.photos[0].images.small}
              alt="suggestion image background"
              priority
              fill
              sizes="(max-width: 768px) 300px, (max-width: 1200px) 300px"
            />

            <div className="w-full flex items-center gap-1 z-20 absolute bottom-0 left-0 px-2 py-1 bg-black/45">
              <Avatar>
                <AvatarImage src={suggestion.photos[0].photographer_profile_image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <a href={suggestion.photos[0].photographer_url} target="_blank" className="text-xs text-white/80">
                {suggestion.photos[0].photographer_name}
              </a>
              <a href={suggestion.photos[0].unsplash_url} target="_blank" className="text-xs ml-auto text-white/80">
                Unsplash
              </a>
            </div>
          </div>
        )}
      </CardContent>

      {suggestion && (
        <CardHeader className="px-2">
          <CardTitle>{suggestion.title}</CardTitle>
          <CardDescription className="line-clamp-3">{suggestion.description}</CardDescription>
        </CardHeader>
      )}
    </Card>
  );
}
