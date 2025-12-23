// Question: MongoDB connection using mongoose and dotenv env variable

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    // MongoDB connection using .env variable
    await mongoose.connect(process.env.MONGO_URI);

    console.log("db connected");
  } catch (error) {
    console.error("db error:", error.message);
    process.exit(1); // app band ho jaye agar db connect na ho
  }
};

export default connectDb;
