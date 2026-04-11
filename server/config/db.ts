import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://senitha_db_user:nD0htN4MehvHymWd@cluster0.kinvutx.mongodb.net/skillify_db?retryWrites=true&w=majority';

export let lastDbError: string | null = null;

export const connectDB = async () => {
  if (!MONGODB_URI) {
    lastDbError = 'MONGODB_URI is missing. Please add it in the Secrets panel (Settings -> Secrets).';
    console.error('❌ CRITICAL ERROR:', lastDbError);
    return;
  }

  try {
    const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
    console.log(`Attempting to connect to MongoDB with URI: ${maskedUri}`);
    
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Already connected to MongoDB');
      lastDbError = null;
      return;
    }
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('✅ Successfully connected to MongoDB Atlas');
    lastDbError = null;
  } catch (err: any) {
    lastDbError = err.message;
    console.error('❌ MongoDB connection error:', err.message);
  }
};
