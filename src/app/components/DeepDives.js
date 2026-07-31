"use client";
import { useState } from "react";
import styles from "./DeepDives.module.css";
import { deepDives } from "@/data/site";

export default function DeepDives() {
  const [open, setOpen] = useState(() => new Set(["debounce"]));

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <section className="section" id="engineering">
      <div className="wrap">
        <p className="eyebrow">Engineering notes</p>
        <h2 className="h2">Problems I&apos;ve had to think hard about.</h2>
        <p className="lede">
          Distributed systems come down to a few stubborn questions: who owns
          this piece of state, what happens if it runs twice, and what do you do
          when the other side stops answering. Six times I had to write a real
          answer rather than a hopeful one.
        </p>

        <div className={styles.grid}>
          {deepDives.map((d) => {
            const isOpen = open.has(d.id);
            return (
              <article
                key={d.id}
                className={`${styles.card} ${isOpen ? styles.open : ""}`}
              >
                <button
                  className={styles.head}
                  onClick={() => toggle(d.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.tag}>{d.tag}</span>
                  <h3>{d.title}</h3>
                  <span className={styles.plus} aria-hidden="true" />
                </button>

                <div className={styles.problem}>
                  <span className={styles.label}>Problem</span>
                  <p>{d.problem}</p>
                </div>

                {isOpen && (
                  <div className={styles.solution}>
                    <span className={styles.label}>What I built</span>
                    <ul>
                      {d.solution.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                    <p className={styles.metric}>{d.metric}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
