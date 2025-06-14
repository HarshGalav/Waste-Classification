import { NextRequest, NextResponse } from 'next/server';
import { analyzeWasteImage } from '@/app/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const analysis = await analyzeWasteImage(base64Image);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze-waste API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}