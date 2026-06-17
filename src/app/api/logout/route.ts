import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: 'hansraj_admin', value: '', path: '/', maxAge: 0 });
  return res;
}
