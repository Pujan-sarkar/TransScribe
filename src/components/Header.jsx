import React, { useState, useEffect } from "react";

export default function Header() {
  const [isLightMode, setIsLightMode] = useState(true); // Default to light mode

  // Toggle light mode
  const toggleLightMode = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  // Apply theme to the document body
  useEffect(() => {
    if (!isLightMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isLightMode]);

  return (
    <header className="flex items-center justify-between gap-4 p-4">
      <a href="/">
        <h1 className="font-medium">
          Trans<span className="text-blue-400 bold">Scribe</span>
        </h1>
      </a>
      <div className="gap-4 flex items-center">
        <a
          href="/"
          className="flex items-center gap-2 specialBtn px-3 py-2 rounded-lg text-blue-400"
        >
          <p>New</p>
          <i className="fa-solid fa-plus"></i>
        </a>
        <button
          onClick={toggleLightMode}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-400"
        >
          {isLightMode ? (
            <i className="fa-solid fa-sun text-yellow-400"></i>
          ) : (
            <i className="fa-solid fa-moon text-blue-400"></i>
          )}
          <span>{isLightMode ? "" : ""}</span>
        </button>
      </div>
    </header>
  );
}
