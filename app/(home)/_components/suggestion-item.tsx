import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@chadcn/components/ui/card';

import Image from 'next/image';

export type SuggestionItemProps = {
  imgSrc: string;
  title: string;
  description: string;
};

export function SuggestionItem({ imgSrc, title, description }: SuggestionItemProps) {
  return (
    <Card className="px-0 py-3">
      <CardContent className="px-2">
        <div className="relative aspect-[2/1] rounded-xl overflow-hidden">
          <Image src={imgSrc} alt="suggestion image background" priority fill />
        </div>
      </CardContent>
      <CardHeader className="px-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
