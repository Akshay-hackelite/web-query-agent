// services/embed.js
const { connectToDatabase } = require("./db");
const { pipeline } = require("@xenova/transformers");

let embedder;

// Load embedding model once
async function loadEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

// Get embedding vector for a query
async function getEmbedding(text) {
  const model = await loadEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return output.data; // Returns a Float32Array or Array of numbers
}

// Cosine similarity between two vectors
function cosineSimilarity(vec1, vec2) {
  if (!Array.isArray(vec2)) vec2 = Object.values(vec2); // Fix for stored objects

  const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return dot / (mag1 * mag2);
}


// Find a past query with similar embedding
async function findSimilarQuery(query) {
  const db = await connectToDatabase();
  const collection = db.collection("queries");

  const currentEmbedding = await getEmbedding(query);

  // Convert Float32Array to regular Array for MongoDB compatibility
  const currentEmbeddingArray = Array.from(currentEmbedding);

  const SIMILARITY_THRESHOLD = 0.85; // Define your threshold

  const results = await collection.aggregate([
  {
    $vectorSearch: {
      queryVector: currentEmbeddingArray,
      path: "embedding",
      numCandidates: 10,
      limit: 1,
      index: "default", // ⬅️ must match your created index
    },
  },
  {
    $project: {
      _id: 0,
      query: 1,
      summary: 1,
      similarity: { $meta: "vectorSearchScore" },
    },
  },
  {
    $match: {
      similarity: { $gte: SIMILARITY_THRESHOLD },
    },
  }
]).toArray();

console.log("Similar query search results:", results);


  if (results.length > 0) {
    console.log("Similar query found with similarity:", results[0].similarity);
    return results[0]; // Return the most similar result
  }

  return null;
}

// Also, in saveQuery, ensure embedding is a regular Array:
async function saveQuery(query, summary) {
  const db = await connectToDatabase();
  const collection = db.collection("queries");

  const embedding = await getEmbedding(query);

  await collection.insertOne({
    query,
    summary,
    embedding: Array.from(embedding), // Ensure it's saved as a regular array
    createdAt: new Date(),
  });
}


module.exports = {
  findSimilarQuery,
  saveQuery,
};
