import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    console.log('Testing MongoDB connection...');
    
    // Check environment variables
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || 'ecowaste';
    
    if (!uri) {
      return NextResponse.json({ 
        error: 'MONGODB_URI not configured',
        env: {
          MONGODB_URI: 'NOT SET',
          MONGODB_DB: dbName
        }
      }, { status: 500 });
    }

    console.log('MongoDB URI configured, attempting connection...');
    console.log('Database name:', dbName);
    
    // Test connection
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('Connected successfully, testing database operations...');
    
    const db = client.db(dbName);
    
    // Test basic operations
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    // Test users collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    
    // Test submissions collection
    const submissionsCollection = db.collection('submissions');
    const submissionCount = await submissionsCollection.countDocuments();
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      database: dbName,
      collections: collections.map(c => c.name),
      stats: {
        users: userCount,
        submissions: submissionCount
      },
      message: 'MongoDB connection successful'
    });
    
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    let errorMessage = 'Unknown error';
    let errorType = 'UNKNOWN';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (errorMessage.includes('authentication')) {
        errorType = 'AUTHENTICATION_FAILED';
      } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
        errorType = 'NETWORK_ERROR';
      } else if (errorMessage.includes('DNS') || errorMessage.includes('hostname')) {
        errorType = 'DNS_ERROR';
      } else if (errorMessage.includes('credentials')) {
        errorType = 'INVALID_CREDENTIALS';
      }
    }
    
    return NextResponse.json({
      error: 'MongoDB connection failed',
      errorType,
      errorMessage,
      env: {
        MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
        MONGODB_DB: process.env.MONGODB_DB || 'ecowaste'
      }
    }, { status: 500 });
  }
}