import React, { useState } from "react";
import QueryForm from "./QueryForm";
import Loader from "./Loader";
import ResultDisplay from "./ResultDisplay";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);          // 🔄 Show loader
    setResult(null);           // 🧹 Clear previous result

    try {
      const response = await fetch("http://localhost:3000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResult(data);         // ✅ Show new result
    } catch (error) {
      setResult({ summary: "Error: Failed to fetch data.", cached: false });
    } finally {
      setLoading(false);       // 🔚 Hide loader
    }
  };

  return (
    <div className="app fade-in">
      <h1 className="app-title fade-in">Web Query Agent</h1>
      <QueryForm onSearch={handleSearch} />
      {loading ? (
        <Loader />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </div>
  );
}

export default App;
