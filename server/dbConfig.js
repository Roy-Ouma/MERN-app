import mongoose from "mongoose";

export default async function dbConnection() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error("Mongo connection string not set in environment (MONGO_URI or MONGODB_URI)");

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Database connection error:", err && err.message ? err.message : err);
    throw err;
  }
}