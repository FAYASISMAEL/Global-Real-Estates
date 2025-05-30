import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/propertyDB', {
      serverSelectionTimeoutMS: 5000
    });
    
    await mongoose.connection.db.admin().ping();
    console.log('Successfully connected to MongoDB.');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

export { connectDB };
