import React from "react";
import "./ResultDisplay.css";

function ResultDisplay({ result }) {
  return (
    <div className="result-box slide-in">
      {result.message ? (
        <p>{result.message}</p>
      ) : (
        <>
          <p>{result.summary}</p>
          <small>{result.cached ? "✅ Served from cache" : "🌐 Fetched live"}</small>
        </>
      )}
    </div>
  );
}

export default ResultDisplay;
