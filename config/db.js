import mongoose from 'mongoose';

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using the MONGO_URI environment variable
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    // Log any connection errors and exit the process
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
