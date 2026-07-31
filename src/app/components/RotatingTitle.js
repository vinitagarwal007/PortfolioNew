"use client";
import { useEffect, useState } from "react";
import styles from "./RotatingTitle.module.css";

/**
 * Cycles job titles in place. Every title occupies the same grid cell, so the
 * container is always as wide as the longest one and nothing around it shifts
 * as they swap.
 */
export default function RotatingTitle({ titles, interval = 2600 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (titles.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % titles.length),
      interval
    );
    return () => clearInterval(id);
  }, [titles, interval]);

  return (
    <span className={styles.rotator}>
      {/* keeps the line height honest without measuring anything */}
      <span className={styles.spacer} aria-hidden="true">
        {titles.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>

      {titles.map((title, i) => (
        <span
          key={title}
          className={`${styles.item} ${i === index ? styles.on : ""}`}
          aria-hidden={i === index ? undefined : true}
        >
          {title}
        </span>
      ))}
    </span>
  );
}
