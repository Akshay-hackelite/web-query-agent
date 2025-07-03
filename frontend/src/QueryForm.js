import React, { useState } from "react";
import "./QueryForm.css";

function QueryForm({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSearch(input); // Let App handle loading & result
  };

  return (
    <form className="fade-in-up" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="query-input"
      />
      <button type="submit" className="query-button">Search</button>
    </form>
  );
}

export default QueryForm;
