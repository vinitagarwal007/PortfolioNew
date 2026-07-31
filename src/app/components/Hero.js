"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { profile, stats } from "@/data/site";
import { GithubIcon, LinkedinIcon, MailIcon, MediumIcon } from "./icons";

function useTypewriter(words, speed = 65, hold = 1600) {
  const [text, setText] = useState("");
  const state = useRef({ i: 0, sub: 0, del: false });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(words[0]);
      return;
    }
    let timer;
    const tick = () => {
      const s = state.current;
      const word = words[s.i % words.length];
      s.sub += s.del ? -1 : 1;
      setText(word.slice(0, s.sub));

      let delay = s.del ? speed / 2.2 : speed;
      if (!s.del && s.sub === word.length) {
        delay = hold;
        s.del = true;
      } else if (s.del && s.sub === 0) {
        s.del = false;
        s.i += 1;
        delay = 340;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [words, speed, hold]);

  return text;
}

/** Fake-but-plausible live telemetry, so the panel feels alive without lying. */
function useTelemetry() {
  const [t, setT] = useState({ rps: 118, p99: 82, queue: 14, uptime: 99.98 });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setT((prev) => ({
        rps: Math.max(60, Math.min(240, prev.rps + (Math.random() - 0.5) * 26)),
        p99: Math.max(38, Math.min(180, prev.p99 + (Math.random() - 0.5) * 16)),
        queue: Math.max(0, Math.min(90, prev.queue + (Math.random() - 0.5) * 9)),
        uptime: prev.uptime,
      }));
    }, 1400);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Hero() {
  const typed = useTypewriter(profile.roles);
  const tele = useTelemetry();

  return (
    <section className={styles.hero} id="top">
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.left}>
          <p className={styles.badge}>
            <span className={styles.live} />
            {profile.role} · {profile.location}
          </p>

          <h1 className={styles.name}>
            Vinit{" "}
            <br />
            Agarwal
            <span className="sr-only">
              {" "}
              — {profile.role} based in {profile.location}
            </span>
          </h1>

          <p className={styles.headline}>{profile.headline}</p>

          <p className={styles.typedLine}>
            <span className={styles.typedPrefix}>Mostly:</span>{" "}
            <span className={styles.typed}>
              {typed}
              <span className={styles.caret} />
            </span>
          </p>

          <p className={styles.plain}>
            <span className={styles.plainLabel}>Without the jargon</span>
            {profile.plain}
          </p>

          <div className={styles.actions}>
            <a className={styles.primary} href="#approach">
              How I work
              <span aria-hidden="true">→</span>
            </a>
            <a className={styles.ghost} href="#arcade">
              Play something instead
            </a>
          </div>

          <div className={styles.socials}>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GithubIcon />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinIcon />
            </a>
            <a
              href={profile.socials.medium}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Medium"
            >
              <MediumIcon />
            </a>
            <a href={profile.socials.mail} aria-label="Email">
              <MailIcon />
            </a>
          </div>
        </div>

        <aside className={styles.panel} aria-label="Illustrative service telemetry">
          <header className={styles.panelHead}>
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.panelTitle}>comm-core · production</span>
          </header>

          <div className={styles.gauges}>
            <Gauge label="req/s" value={Math.round(tele.rps)} max={240} />
            <Gauge label="p99 ms" value={Math.round(tele.p99)} max={180} />
            <Gauge label="queue" value={Math.round(tele.queue)} max={90} />
          </div>

          <ul className={styles.logLines}>
            <li>
              <span className={styles.ok}>OK</span> batch.fire → kaleyra
              <em>sub-batch 12/40</em>
            </li>
            <li>
              <span className={styles.ok}>OK</span> dlr.normalize → meta
              <em>1 canonical event</em>
            </li>
            <li>
              <span className={styles.warn}>RETRY</span> crm.egress → 503
              <em>backoff 4/10</em>
            </li>
            <li>
              <span className={styles.ok}>OK</span> debounce.collapse
              <em>6 msgs → 1</em>
            </li>
          </ul>

          <footer className={styles.panelFoot}>
            <span>uptime {tele.uptime}%</span>
            <span>sticky sessions: none</span>
          </footer>
        </aside>
      </div>

      <div className={`wrap ${styles.statsWrap}`}>
        <ul className={styles.stats}>
          {stats.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
              <em>{s.note}</em>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Gauge({ label, value, max }) {
  const pct = Math.max(4, Math.min(100, (value / max) * 100));
  return (
    <div className={styles.gauge}>
      <div className={styles.gaugeTop}>
        <span>{label}</span>
        <b>{value}</b>
      </div>
      <div className={styles.bar}>
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
