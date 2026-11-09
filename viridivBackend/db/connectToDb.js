import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDB = async () => {
  try {
    const mongoUrl = process.env.DB_URI || "mongodb://localhost:27017/viridiv";
    const maskedUrl = mongoUrl.replace(/:([^:@]+)@/, ":****@");
    console.log("Attempting to connect to: " + maskedUrl);
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.log("Error connecting to database" + error.message);
  }
};

export default connectToDB;
