import { NextResponse } from 'next/server';

export async function GET() {
  // Only show this in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const envCheck = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    MONGODB_DB: process.env.MONGODB_DB || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json(envCheck);
}