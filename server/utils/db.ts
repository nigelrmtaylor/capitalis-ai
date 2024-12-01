import mongoose from 'mongoose'

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return
    }

    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/capitalis'
    
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}
