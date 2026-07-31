import styles from "./Principles.module.css";
import { principles, profile } from "@/data/site";

export default function Principles() {
  return (
    <section className="section" id="approach">
      <div className="wrap">
        <p className="eyebrow">How I work</p>
        <h2 className="h2">Five things that show up in everything I build.</h2>
        <p className="lede">{profile.blurb}</p>

        <p className={styles.guide}>
          Each one reads twice: first in plain language, then the same idea for
          engineers. Skip whichever half isn&apos;t yours.
        </p>

        <div className={styles.list}>
          {principles.map((p, i) => (
            <article key={p.id} className={styles.item}>
              <div className={styles.side}>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
              </div>

              <div className={styles.body}>
                <p className={styles.plain}>{p.plain}</p>

                <div className={styles.tech}>
                  <span className={styles.techLabel}>In practice</span>
                  <p>{p.technical}</p>
                </div>

                <p className={styles.evidence}>{p.evidence}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
