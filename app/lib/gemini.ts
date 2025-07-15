import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface WasteAnalysisResult {
  wasteType: string;
  quantity: string;
  confidence: number;
  estimatedPoints: number;
  description: string;
}

export async function analyzeWasteImage(imageBase64: string): Promise<WasteAnalysisResult> {
  // Check if API key is available
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Analyze this waste image and provide the following information in JSON format:
    {
      "wasteType": "category of waste (plastic, paper, metal, glass, organic, electronic, textile, other)",
      "quantity": "estimated quantity (small, medium, large)",
      "confidence": "confidence level as a number between 0-100",
      "estimatedPoints": "points to award (1-15 based on recyclability and environmental impact)",
      "description": "brief description of what you see"
    }

    Consider these point values:
    - Electronic waste: 8-15 points (high value, needs special handling)
    - Metal: 6-12 points (highly recyclable)
    - Glass: 5-10 points (recyclable but heavy)
    - Plastic: 3-8 points (varies by type)
    - Paper: 2-6 points (easily recyclable)
    - Organic: 1-4 points (compostable)
    - Textile: 2-7 points (depends on condition)
    - Other: 1-5 points (case by case)

    Quantity multipliers:
    - Small: base points
    - Medium: base points × 1.5
    - Large: base points × 2

    Please respond with ONLY the JSON object, no additional text.
  `;

  try {
    console.log('Sending request to Gemini AI...');
    
    const result = await model.generateContent([
      {
        text: prompt
      },
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);
    
    // Clean up the response text
    let cleanText = text.trim();
    
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    
    // Extract JSON from the response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[0]);
      
      // Validate the result structure
      if (!parsedResult.wasteType || !parsedResult.quantity || !parsedResult.confidence || !parsedResult.estimatedPoints) {
        throw new Error('Invalid AI response structure');
      }
      
      // Ensure numeric values are numbers
      parsedResult.confidence = Number(parsedResult.confidence);
      parsedResult.estimatedPoints = Number(parsedResult.estimatedPoints);
      
      // Validate ranges
      if (parsedResult.confidence < 0 || parsedResult.confidence > 100) {
        parsedResult.confidence = Math.max(0, Math.min(100, parsedResult.confidence));
      }
      
      if (parsedResult.estimatedPoints < 1 || parsedResult.estimatedPoints > 15) {
        parsedResult.estimatedPoints = Math.max(1, Math.min(15, parsedResult.estimatedPoints));
      }
      
      return parsedResult;
    }
    
    throw new Error('Could not parse AI response as JSON');
  } catch (error) {
    console.error('Error analyzing waste image:', error);
    
    // Provide a fallback response if AI fails
    if (error instanceof Error && (
      error.message.includes('API key') || 
      error.message.includes('authentication') ||
      error.message.includes('quota') ||
      error.message.includes('limit')
    )) {
      throw error; // Re-throw API-related errors
    }
    
    // For other errors, provide a generic fallback
    console.log('Providing fallback analysis due to AI error');
    return {
      wasteType: 'other',
      quantity: 'medium',
      confidence: 50,
      estimatedPoints: 3,
      description: 'Unable to analyze image with AI - manual review recommended'
    };
  }
}