import mongoose from "mongoose";

export const connectDB = async () => {
  const dbUri = process.env.DBURI;
  if (!dbUri) {
    throw new Error("DBURI environment variable is not set");
  }

  await mongoose.connect(dbUri);
  console.log("MongoDB connected successfully");
};
