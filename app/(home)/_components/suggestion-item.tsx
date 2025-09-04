import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@chadcn/components/ui/card';
import { Ghost } from 'lucide-react';

import Image from 'next/image';

export type SuggestionItemProps =
  | {
      imgSrc: string;
      title: string;
      description: string;
    }
  | {
      imgSrc: null;
      title?: undefined;
      description?: undefined;
    };

export function SuggestionItem({ imgSrc, title, description }: SuggestionItemProps) {
  return (
    <Card className="px-0 py-3">
      <CardContent className="px-2">
        {imgSrc && (
          <div className="relative aspect-[2/1] rounded-xl overflow-hidden">
            <Image
              src={imgSrc}
              alt="suggestion image background"
              priority
              fill
              sizes="(max-width: 768px) 300px, (max-width: 1200px) 300px"
            />
          </div>
        )}

        {!imgSrc && (
          <div className="flex flex-col items-center gap-3">
            <Ghost size={60} />
            <p className="text-gray-400 my-0">No data to show.</p>
          </div>
        )}
      </CardContent>

      {imgSrc && (
        <CardHeader className="px-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-3">{description}</CardDescription>
        </CardHeader>
      )}
    </Card>
  );
}
