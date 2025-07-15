import { NextRequest, NextResponse } from 'next/server';
import { analyzeWasteImage } from '@/app/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate image format
    if (!image.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Validate base64 content
    if (!base64Image || base64Image.length < 100) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    console.log('Analyzing waste image with Gemini AI...');
    const analysis = await analyzeWasteImage(base64Image);
    
    console.log('Analysis completed:', analysis);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze-waste API:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service authentication failed' },
          { status: 401 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'AI service quota exceeded' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}