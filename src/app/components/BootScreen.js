"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./BootScreen.module.css";

const SEQUENCE = [
  { text: "$ ssh operator@vinit.sys", cmd: true },
  { text: "establishing secure channel", status: "OK" },
  { text: "resolving distributed nodes [9/9]", status: "OK" },
  { text: "authenticating operator credentials", status: "OK" },
  { text: "mounting /vinit/experience", status: "OK" },
  { text: "decrypting portfolio payload", status: "100%" },
  { text: "bypassing corporate jargon filter", status: "OK" },
];

const STEP_MS = 190;
const SEEN_KEY = "vinit.boot.seen";

export default function BootScreen() {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const [granted, setGranted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLeaving(true);
    const t = setTimeout(() => {
      setVisible(false);
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* private mode — just don't remember it */
      }
    }, 480);
    timers.current.push(t);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      setVisible(false);
      return;
    }

    const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));

    SEQUENCE.forEach((_, i) => push(() => setStep(i + 1), STEP_MS * (i + 1)));

    const grantAt = STEP_MS * (SEQUENCE.length + 1);
    push(() => setGranted(true), grantAt);
    push(finish, grantAt + 900);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [finish]);

  // lock the page behind the overlay while it's up
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // any key or click skips
  useEffect(() => {
    if (!visible) return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [visible, finish]);

  if (!visible) return null;

  const pct = Math.round((Math.min(step, SEQUENCE.length) / SEQUENCE.length) * 100);

  return (
    <div
      id="boot"
      className={`${styles.boot} ${leaving ? styles.leaving : ""}`}
      role="status"
      aria-label="Loading"
    >
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.terminal}>
        <ul className={styles.lines}>
          {SEQUENCE.slice(0, step).map((line, i) => (
            <li key={line.text} className={line.cmd ? styles.cmd : ""}>
              <span className={styles.lineText}>{line.text}</span>
              {line.status && (
                <>
                  <span className={styles.dots} aria-hidden="true" />
                  <span
                    className={
                      line.status === "OK" ? styles.ok : styles.pctTag
                    }
                  >
                    {line.status}
                  </span>
                </>
              )}
            </li>
          ))}
          {!granted && step > 0 && (
            <li className={styles.cursorLine}>
              <span className={styles.cursor} />
            </li>
          )}
        </ul>

        <div className={styles.meter} aria-hidden="true">
          <i style={{ width: `${pct}%` }} />
        </div>

        {granted && (
          <div className={styles.granted}>
            <span className={styles.grantedText}>ACCESS GRANTED</span>
            <span className={styles.grantedSub}>
              welcome — you&apos;re looking at Vinit Agarwal
            </span>
          </div>
        )}

        <p className={styles.hint}>press any key to skip</p>
      </div>

      <noscript>
        <style>{`#boot{display:none}`}</style>
      </noscript>
    </div>
  );
}
