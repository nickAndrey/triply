import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/chadcn/components/ui/card';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex items-center justify-center h-[100dvh]">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>404 Page Not Found</CardTitle>
          <CardDescription>Could not find requested resource.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className="text-link underline">
            Return Home
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
