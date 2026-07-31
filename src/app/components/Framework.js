"use client";
import { useState } from "react";
import styles from "./Framework.module.css";
import { framework } from "@/data/site";

export default function Framework() {
  const [active, setActive] = useState(0);
  const provider = framework.providers[active];

  return (
    <section className="section" id="framework">
      <div className="wrap">
        <p className="eyebrow">{framework.eyebrow}</p>
        <h2 className="h2">{framework.title}</h2>
        <p className="lede">{framework.plain}</p>
        <p className={styles.ledeTech}>{framework.lede}</p>

        <ul className={styles.outcomes}>
          {framework.outcomes.map(([value, label]) => (
            <li key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className={styles.translator}>
          <header className={styles.tHead}>
            <div>
              <p className={styles.tTitle}>Same contract, eight dialects</p>
              <p className={styles.tSub}>
                Pick a provider. The left side is what they send. The right side
                is what every system above the framework actually reads.
              </p>
            </div>
            <span className={styles.illustrative}>illustrative shapes</span>
          </header>

          <div className={styles.providerRow}>
            {framework.providers.map((p, i) => (
              <button
                key={p.name}
                className={`${styles.provider} ${
                  i === active ? styles.providerOn : ""
                }`}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className={styles.panes}>
            <div className={styles.pane}>
              <div className={styles.paneHead}>
                <span className={styles.paneLabel}>inbound · vendor native</span>
                <span className={styles.paneMeta}>{provider.transport}</span>
              </div>
              <pre className={`${styles.code} thin-scroll`}>{provider.raw}</pre>
              <p className={styles.paneFoot}>auth: {provider.auth}</p>
            </div>

            <div className={styles.arrow} aria-hidden="true">
              <span className={styles.arrowLine} />
              <span className={styles.arrowChip}>normalise</span>
              <span className={styles.arrowLine} />
            </div>

            <div className={`${styles.pane} ${styles.paneOut}`}>
              <div className={styles.paneHead}>
                <span className={styles.paneLabel}>
                  outbound · standard system vars
                </span>
                <span className={styles.paneMeta}>identical for all 8</span>
              </div>
              <pre className={`${styles.code} thin-scroll`}>
                {Object.entries(provider.canonical).map(([k, v]) => (
                  <span key={k} className={styles.line}>
                    <span className={styles.key}>{k}</span>
                    <span className={styles.punct}>: </span>
                    <span
                      className={
                        v === null
                          ? styles.null
                          : typeof v === "boolean"
                          ? styles.bool
                          : styles.str
                      }
                    >
                      {v === null ? "null" : String(v)}
                    </span>
                    {"\n"}
                  </span>
                ))}
              </pre>
              <p className={styles.paneFoot}>
                one canonical event · one processing path
              </p>
            </div>
          </div>
        </div>

        <div className={styles.contract}>
          <div className={styles.contractText}>
            <span className={styles.contractLabel}>The contract</span>
            <p>{framework.contract}</p>
          </div>

          <div className={styles.vocab}>
            <span className={styles.contractLabel}>Vendor vocabulary → system vocabulary</span>
            <ul>
              {framework.vocabulary.map((row) => (
                <li key={row.to}>
                  <span className={styles.vocabFrom}>
                    {row.from.map((f) => (
                      <code key={f}>{f}</code>
                    ))}
                  </span>
                  <span className={styles.vocabArrow} aria-hidden="true">
                    →
                  </span>
                  <span className={`${styles.vocabTo} ${styles[row.tone]}`}>
                    {row.to}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.pillars}>
          {framework.pillars.map((p, i) => (
            <article key={p.title} className={styles.pillar}>
              <span className={styles.pillarNum}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
