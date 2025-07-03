const express = require("express");
const router = express.Router();
const { scrapeAndSummarize } = require("../services/scrape");
const { classifyQuery } = require("../services/classify");
const { findSimilarQuery, saveQuery } = require("../services/embed"); // ✅ both

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const classification = await classifyQuery(query);
    if (classification === "invalid") {
      return res.json({ message: "This is not a valid query." });
    }

    // First, check if there's a similar past query
    const cachedResult = await findSimilarQuery(query);
    if (cachedResult) {
      return res.json({ summary: cachedResult.summary, cached: true });
    }

    // No similar result found → scrape and store
    const summary = await scrapeAndSummarize(query);
    await saveQuery(query, summary);

    return res.json({ summary, cached: false });

  } catch (err) {
    console.error("query error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
