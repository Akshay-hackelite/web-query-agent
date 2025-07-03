import React from "react";
import "./Loader.css"; // import styles

function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Searching and summarizing...</p>
    </div>
  );
}

export default Loader;
