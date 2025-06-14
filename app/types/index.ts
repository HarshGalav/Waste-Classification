export interface WasteSubmission {
    id: string;
    userId: string;
    imageUrl: string;
    wasteType: string;
    quantity: string;
    estimatedPoints: number;
    status: 'pending' | 'verified' | 'rejected';
    submittedAt: Date;
    verifiedAt?: Date;
    verifierImage?: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    points: number;
    totalSubmissions: number;
    verifiedSubmissions: number;
  }
  
  export interface WasteAnalysis {
    wasteType: string;
    quantity: string;
    confidence: number;
    estimatedPoints: number;
    description: string;
  }