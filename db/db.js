import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

async function connect() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connection successful");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connect().catch(console.error);
