// services/db.js
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db("queryAgent");
    console.log("✅ Connected to MongoDB");
  }
  return db;
}

module.exports = { connectToDatabase };
