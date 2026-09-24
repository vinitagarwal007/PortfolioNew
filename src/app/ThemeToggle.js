"use client";
import { useEffect, useState } from "react";

// The theme itself is set by the inline script in layout.js; this only mirrors
// data-theme so the label names the action, and asks the script to switch.
export default function ThemeToggle({ className }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(root.getAttribute("data-theme"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className={className}
      aria-label={theme ? `Switch to ${next} theme` : "Toggle colour theme"}
      onClick={() => window.__setTheme?.(next)}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
      </svg>
    </button>
  );
}
