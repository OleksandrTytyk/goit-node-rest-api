import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

async function connect() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connected...");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

connect().catch(console.error);
