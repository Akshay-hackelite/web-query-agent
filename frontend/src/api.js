// src/api.js
const API_URL = "http://localhost:3000/query"; // or your deployed backend URL

export async function sendQuery(query) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return await res.json();
}
