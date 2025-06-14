import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface WasteAnalysisResult {
  wasteType: string;
  quantity: string;
  confidence: number;
  estimatedPoints: number;
  description: string;
}

export async function analyzeWasteImage(imageBase64: string): Promise<WasteAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Analyze this waste image and provide the following information in JSON format:
    {
      "wasteType": "category of waste (plastic, paper, metal, glass, organic, electronic, textile, other)",
      "quantity": "estimated quantity (small, medium, large, or specific amount if measurable)",
      "confidence": "confidence level as a number between 0-100",
      "estimatedPoints": "points to award (1-10 based on recyclability and environmental impact)",
      "description": "brief description of what you see"
    }

    Consider these point values:
    - Electronic waste: 8-10 points (high value, needs special handling)
    - Metal: 6-8 points (highly recyclable)
    - Glass: 5-7 points (recyclable but heavy)
    - Plastic: 3-6 points (varies by type)
    - Paper: 2-4 points (easily recyclable)
    - Organic: 1-3 points (compostable)
    - Textile: 2-5 points (depends on condition)
    - Other: 1-3 points (case by case)

    Quantity multipliers:
    - Small: base points
    - Medium: base points × 1.5
    - Large: base points × 2
  `;

  try {
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
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Error analyzing waste image:', error);
    throw new Error('Failed to analyze waste image');
  }
}