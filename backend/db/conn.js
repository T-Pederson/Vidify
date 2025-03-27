const { MongoClient } = require("mongodb");

const connectionString = process.env.MONGODB_URI || "";
const client = new MongoClient(connectionString);

let db;

async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("vidify");
      console.log("Connected to MongoDB");
    } catch (e) {
      console.error("MongoDB connection error:", e);
    }
  }
  return db;
}

module.exports = connectDB;
