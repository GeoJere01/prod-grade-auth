import mongoose from "mongoose";

export default async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    console.log("You have successfully connected to the database!!!");
  } catch (error) {
    console.error("Failed to connect to mongoDB, please try again.", error);
    process.exit(1);
  }
}
