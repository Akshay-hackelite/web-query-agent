const { pipeline } = require("@xenova/transformers");

let classifier;

async function classifyQuery(query) {
  if (!classifier) {
    classifier = await pipeline("zero-shot-classification", "Xenova/nli-deberta-base");
  }

  const labels = ["valid information query", "personal task or command"];
  const result = await classifier(query, labels);

  const topLabel = result.labels[0];
  const score = result.scores[0];

  // Optional: Threshold can be adjusted
  if (topLabel === "personal task or command" && score > 0.6) {
    return "invalid";
  }

  return "valid";
}

module.exports = { classifyQuery };
