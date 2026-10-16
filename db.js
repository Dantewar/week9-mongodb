
import mongoose from "mongoose";

export function connectDB() {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      process.exitCode = 1;
      throw error;
    });
}
