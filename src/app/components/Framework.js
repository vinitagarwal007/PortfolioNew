import Link from "next/link";
import styles from "./Framework.module.css";
import { framework } from "@/data/site";

export default function Framework() {
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

        <div className={styles.contract}>
          <div className={styles.contractText}>
            <span className={styles.contractLabel}>The contract</span>
            <p>{framework.contract}</p>
          </div>

          <div className={styles.vocab}>
            <span className={styles.contractLabel}>
              Vendor vocabulary → system vocabulary
            </span>
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

        <div className={styles.explore}>
          <Link href="/systems" className={styles.exploreCard}>
            <span className={styles.exploreLabel}>Explore</span>
            <strong>The nine services it runs across</strong>
            <span className={styles.exploreDesc}>
              An interactive map of the stack — ingress, core, egress and agent
              runtime. Pick a node to see what I built inside it.
            </span>
            <span className={styles.exploreGo}>
              Open the map <span aria-hidden="true">→</span>
            </span>
          </Link>

          <Link href="/throttle" className={styles.exploreCard}>
            <span className={styles.exploreLabel}>Play</span>
            <strong>How 40,000 messages actually leave</strong>
            <span className={styles.exploreDesc}>
              Set throttle windows per integration and watch the scheduler
              spread the load — or turn throttling off and get rate limited.
            </span>
            <span className={styles.exploreGo}>
              Open the simulator <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
