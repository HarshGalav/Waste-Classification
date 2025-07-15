import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// Temporary in-memory storage for testing
let submissions: any[] = [];

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/submissions-fallback - Using in-memory storage');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (userId && userId === session.user.id) {
      // Get user's own submissions
      const userSubmissions = submissions.filter(sub => sub.userId === userId);
      return NextResponse.json(userSubmissions);
    } else {
      // Get all submissions
      return NextResponse.json(submissions);
    }
  } catch (error) {
    console.error('Error fetching submissions (fallback):', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/submissions-fallback - Using in-memory storage');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissionData = await request.json();
    
    // Validate required fields
    if (!submissionData.imageUrl || !submissionData.wasteType || !submissionData.quantity || !submissionData.estimatedPoints) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newSubmission = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId: session.user.id,
      imageUrl: submissionData.imageUrl,
      wasteType: submissionData.wasteType,
      quantity: submissionData.quantity,
      estimatedPoints: submissionData.estimatedPoints,
      status: 'pending',
      submittedAt: new Date(),
    };
    
    submissions.unshift(newSubmission);
    
    console.log('Submission created (fallback):', newSubmission.id);
    return NextResponse.json(newSubmission);
  } catch (error) {
    console.error('Error creating submission (fallback):', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}