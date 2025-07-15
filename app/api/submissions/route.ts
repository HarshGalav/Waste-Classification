import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getSubmissions, createSubmission, getUserSubmissions } from '@/app/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/submissions - Starting request');
    
    // Check MongoDB connection first
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    console.log('Session:', session ? 'Found' : 'Not found');
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log('Requested userId:', userId);
    
    if (userId && userId === session.user.id) {
      // Get user's own submissions
      console.log('Fetching user submissions for:', userId);
      const userSubmissions = await getUserSubmissions(userId);
      console.log('Found submissions:', userSubmissions.length);
      return NextResponse.json(userSubmissions);
    } else {
      // Get all submissions (for admin/verification purposes)
      console.log('Fetching all submissions');
      const allSubmissions = await getSubmissions();
      console.log('Found total submissions:', allSubmissions.length);
      return NextResponse.json(allSubmissions);
    }
  } catch (error) {
    console.error('Error fetching submissions:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
      }
      if (error.message.includes('authentication')) {
        return NextResponse.json({ error: 'Database authentication failed' }, { status: 500 });
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch submissions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/submissions - Starting request');
    
    // Check MongoDB connection first
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    console.log('Session for POST:', session ? 'Found' : 'Not found');
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissionData = await request.json();
    console.log('Submission data received:', {
      wasteType: submissionData.wasteType,
      quantity: submissionData.quantity,
      estimatedPoints: submissionData.estimatedPoints,
      hasImageUrl: !!submissionData.imageUrl
    });
    
    // Validate required fields
    if (!submissionData.imageUrl || !submissionData.wasteType || !submissionData.quantity || !submissionData.estimatedPoints) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    console.log('Creating submission for user:', session.user.id);
    const newSubmission = await createSubmission({
      userId: session.user.id,
      imageUrl: submissionData.imageUrl,
      wasteType: submissionData.wasteType,
      quantity: submissionData.quantity,
      estimatedPoints: submissionData.estimatedPoints,
      status: 'pending',
      submittedAt: new Date(),
    });
    
    console.log('Submission created successfully:', newSubmission.id);
    return NextResponse.json(newSubmission);
  } catch (error) {
    console.error('Error creating submission:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
      }
      if (error.message.includes('authentication')) {
        return NextResponse.json({ error: 'Database authentication failed' }, { status: 500 });
      }
      if (error.message.includes('duplicate')) {
        return NextResponse.json({ error: 'Duplicate submission' }, { status: 409 });
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create submission', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}