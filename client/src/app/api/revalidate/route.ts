import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)

  if (searchParams.get('secret') !== process.env.REVALIDATE_SECRET) {
    return Response.json({ success: false }, { status: 401 })
  }

  revalidateTag('departments', 'default');

  return Response.json({ success: true });
}