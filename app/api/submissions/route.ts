import { NextRequest, NextResponse } from 'next/server';

// In a real app, this would connect to a database
const submissions: { id: string; submittedAt: Date; status: string }[] = [];

export async function GET() {
  return NextResponse.json(submissions);
}

export async function POST(request: NextRequest) {
  try {
    const submission = await request.json();
    const newSubmission = {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date(),
      status: 'pending'
    };
    
    submissions.unshift(newSubmission);
    return NextResponse.json(newSubmission);
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}