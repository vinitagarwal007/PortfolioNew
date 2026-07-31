"use client";
import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently dominant in the viewport.
 * Uses a band across the upper-middle of the screen so a section counts as
 * "active" while you're reading it, not only when it first scrolls in.
 */
export default function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!nodes.length) return;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.intersectionRatio));
        let best = null;
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best && bestRatio > 0) setActive(best);
      },
      { rootMargin: "-72px 0px -45% 0px", threshold: [0, 0.15, 0.4, 0.75, 1] }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
