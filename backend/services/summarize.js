const { pipeline } = require("@xenova/transformers");

let summarizer;
async function loadSummarizer() {
  if (!summarizer) {
    summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-12-6");
  }
  return summarizer;
}

async function summarize(text) {
  const model = await loadSummarizer();
  const result = await model(text, { max_length: 100, min_length: 30 });
  return result[0]?.summary_text || "Summary not available.";
}

module.exports = { summarize };
