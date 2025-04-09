import mongoose from "mongoose";

//Database connection
export const connect = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Attempting to connect to MongoDB...');
    
    // Remove all existing listeners to prevent duplicates
    mongoose.connection.removeAllListeners();
    
    mongoose.connection.on("connected", () => {
      console.log("MongoDB successfully connected");
    });

    mongoose.connection.on("error", (error) => {
      console.log("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Basic connection without deprecated options
    return await mongoose.connect(uri);
  } catch (error) {
    console.error('MongoDB connection error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    throw error;
  }
};
