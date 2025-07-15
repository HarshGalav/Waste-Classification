import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { User, WasteSubmission } from '@/app/types';

let client: MongoClient;
let db: Db;

// MongoDB connection
async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || 'ecowaste';

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    
    console.log('Connected to MongoDB Atlas');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Get collections
async function getUsersCollection(): Promise<Collection<User>> {
  const database = await connectToDatabase();
  return database.collection<User>('users');
}

async function getSubmissionsCollection(): Promise<Collection<WasteSubmission>> {
  const database = await connectToDatabase();
  return database.collection<WasteSubmission>('submissions');
}

// User management
export async function getUsers(): Promise<User[]> {
  try {
    const collection = await getUsersCollection();
    return await collection.find({}).toArray();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const collection = await getUsersCollection();
    return await collection.findOne({ id });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function createOrUpdateUser(userData: Partial<User> & { id: string }): Promise<User> {
  try {
    const collection = await getUsersCollection();
    const existingUser = await collection.findOne({ id: userData.id });
    
    if (existingUser) {
      // Update existing user
      const updatedUser = { ...existingUser, ...userData };
      await collection.updateOne(
        { id: userData.id },
        { $set: updatedUser }
      );
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        id: userData.id,
        name: userData.name || '',
        email: userData.email || '',
        points: 0,
        totalSubmissions: 0,
        verifiedSubmissions: 0,
      };
      await collection.insertOne(newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

export async function updateUserPoints(userId: string, pointsToAdd: number): Promise<User | null> {
  try {
    const collection = await getUsersCollection();
    const result = await collection.findOneAndUpdate(
      { id: userId },
      { 
        $inc: { 
          points: pointsToAdd,
          verifiedSubmissions: 1
        }
      },
      { returnDocument: 'after' }
    );
    return result || null;
  } catch (error) {
    console.error('Error updating user points:', error);
    return null;
  }
}

// Submission management
export async function getSubmissions(): Promise<WasteSubmission[]> {
  try {
    const collection = await getSubmissionsCollection();
    return await collection.find({}).sort({ submittedAt: -1 }).toArray();
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

export async function createSubmission(submission: Omit<WasteSubmission, 'id'>): Promise<WasteSubmission> {
  try {
    const collection = await getSubmissionsCollection();
    const usersCollection = await getUsersCollection();
    
    const newSubmission: WasteSubmission = {
      ...submission,
      id: new ObjectId().toString()
    };
    
    await collection.insertOne(newSubmission);
    
    // Update user's total submissions
    await usersCollection.updateOne(
      { id: submission.userId },
      { $inc: { totalSubmissions: 1 } }
    );
    
    return newSubmission;
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
}

export async function updateSubmissionStatus(
  submissionId: string, 
  status: 'verified' | 'rejected',
  verifierImage?: string
): Promise<WasteSubmission | null> {
  try {
    const collection = await getSubmissionsCollection();
    
    const updateData: Record<string, unknown> = {
      status,
      verifiedAt: new Date()
    };
    
    if (verifierImage) {
      updateData.verifierImage = verifierImage;
    }
    
    const result = await collection.findOneAndUpdate(
      { id: submissionId },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (result && status === 'verified') {
      // Add points to user
      await updateUserPoints(result.userId, result.estimatedPoints);
    }
    
    return result || null;
  } catch (error) {
    console.error('Error updating submission status:', error);
    return null;
  }
}

export async function getUserSubmissions(userId: string): Promise<WasteSubmission[]> {
  try {
    const collection = await getSubmissionsCollection();
    return await collection.find({ userId }).sort({ submittedAt: -1 }).toArray();
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return [];
  }
}

export async function getLeaderboard(limit: number = 10): Promise<User[]> {
  try {
    const collection = await getUsersCollection();
    return await collection
      .find({})
      .sort({ points: -1 })
      .limit(limit)
      .toArray();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// Cleanup function for graceful shutdown
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}