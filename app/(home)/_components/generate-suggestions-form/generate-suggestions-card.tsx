import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/chadcn/components/ui/card';
import { GenerateSuggestionsForm } from './generate-suggestions-form';

export function GenerateSuggestionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Your Next Adventure</CardTitle>
        <CardDescription>
          Tell us what you’re looking for and we’ll suggest trips tailored
          for you.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <GenerateSuggestionsForm />
      </CardContent>
    </Card>
  );
}
