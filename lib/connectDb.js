import mongoose from "mongoose";

const connectDb = async () => {
  let isconnected = false;
  mongoose.set("bufferTimeoutMS", 20000);
  console.log("MongoDB URI:", process.env.MONGO_URI?.substring(0, 20) + "..."); // Don’t log full URI!
  try {
    if (isconnected) {
      console.log("Mongoose already connected");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "chat-app",
      serverSelectionTimeoutMS: 30000,
    });
    isconnected = true;
    console.log("CONNECTED TO DATABASE");
  } catch (error) {
    console.log("ERROR CONNECTING TO DATABASE", error);
  }
};
export default connectDb;
