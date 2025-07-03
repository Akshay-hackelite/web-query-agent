// services/scrape.js
const axios = require("axios");
const cheerio = require("cheerio");
const { summarize } = require("./summarize");
const { JSDOM } = require("jsdom");

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const SERPER_API_URL = "https://google.serper.dev/search";

async function scrapeAndSummarize(query) {
  try {
    console.log("Searching:", query);

    const response = await axios.post(
      SERPER_API_URL,
      { q: query },
      {
        headers: {
          "X-API-KEY": SERPER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const links = response.data.organic?.map((item) => item.link).slice(0, 5) || [];
    console.log("Top 5 links:");
    links.forEach((link, i) => {
        console.log(`${i + 1}. ${link}`);
    });

    const fullContent = [];

    for (const link of links) {
      try {
        const html = await axios.get(link, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });

        const dom = new JSDOM(html.data);
        const document = dom.window.document;

        const textContent = Array.from(
          document.querySelectorAll("article, section, p, li, h2, h3")
        )
          .map((el) => el.textContent.trim())
          .filter((text) => text.length > 50)
          .join(" ");

        if (textContent.length > 300) {
          fullContent.push(textContent);
        }
      } catch (err) {
        console.warn("Error scraping", link, err.message);
      }
    }

    if (fullContent.length === 0) {
      return "No relevant information could be retrieved from the web.";
    }

    const combined = fullContent.join("\n\n");
    const longSummary = await summarize(combined);
    return longSummary || "Summary not available.";
  } catch (err) {
    console.error("scrapeAndSummarize failed:", err.message);
    return "Failed to retrieve information.";
  }
}

module.exports = { scrapeAndSummarize };