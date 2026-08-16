const mongoose = require("mongoose");

// Connects to MongoDB using the connection string from .env
async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}

module.exports = connectDB;
