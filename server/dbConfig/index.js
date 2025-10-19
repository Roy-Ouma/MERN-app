import mongoose from "mongoose";

const dbConnection = async () => {
  try {
   await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection error:", + error);
  }
};

export default dbConnection;