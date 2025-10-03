import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { paths } = await req.json();

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: 'paths[] required' }, { status: 400 });
    }

    paths.forEach((p) => revalidatePath(p));

    return NextResponse.json({ revalidated: true, paths });
  } catch (err) {
    console.error('Error revalidating:', err);
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
