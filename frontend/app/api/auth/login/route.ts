import { NextResponse } from 'next/server';
const API_URL = process.env.API_URL;
export async function POST(request: Request) {
  const body = await request.json();
  // 1. Call your Express Backend
  const backendRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    });
  if (!backendRes.ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // 2. Extract the 'Set-Cookie' header from Express
  const cookie = backendRes.headers.get('set-cookie');

  const response = NextResponse.json({ message: 'Login successful' });

  // 3. Forward that cookie to the user's browser
  if (cookie) {
    response.headers.set('set-cookie', cookie);
  }

  return response;
}