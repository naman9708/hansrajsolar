import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (email === 'hansrajsolar@gmail.com' && password === 'Hans@9311') {
      const res = NextResponse.json({ ok: true });
      // set httpOnly cookie; make it secure in production
      const secure = process.env.NODE_ENV === 'production';
      res.cookies.set({
        name: 'hansraj_admin',
        value: '1',
        path: '/',
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax',
        secure,
      });
      return res;
    }
    return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
