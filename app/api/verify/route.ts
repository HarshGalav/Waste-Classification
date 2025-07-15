import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { updateSubmissionStatus } from '@/app/lib/database';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { submissionId, status, verifierImage } = await request.json();
    
    if (!submissionId || !status) {
      return NextResponse.json({ error: 'Submission ID and status are required' }, { status: 400 });
    }

    if (!['verified', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedSubmission = await updateSubmissionStatus(submissionId, status, verifierImage);
    
    if (!updatedSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Error in verify API:', error);
    return NextResponse.json(
      { error: 'Failed to verify submission' },
      { status: 500 }
    );
  }
}