import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/palm_chat";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

export default connectDb;

