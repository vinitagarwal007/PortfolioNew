import Link from "next/link";
import styles from "./Projects.module.css";
import { projects } from "@/data/site";
import { ArrowIcon, ExternalIcon } from "./icons";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <p className="eyebrow">Selected work</p>
        <h2 className="h2">Things I&apos;ve built.</h2>
        <p className="lede">
          One of these runs in production today. The others are from the years
          when getting anything to work at all still felt like magic — I keep
          them here because that part matters too.
        </p>

        <div className={styles.grid}>
          {projects.map((p) => {
            const inner = (
              <>
                <div className={styles.top}>
                  <span className={styles.context}>{p.context}</span>
                  {p.href && !p.internal && (
                    <span className={styles.link} aria-hidden="true">
                      <ExternalIcon width={14} height={14} />
                    </span>
                  )}
                </div>
                <h3>{p.title}</h3>
                <p className={styles.desc}>{p.desc}</p>
                <div className={styles.tags}>
                  {p.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                {p.cta && (
                  <span className={styles.cta}>
                    {p.cta}
                    <ArrowIcon width={15} height={15} />
                  </span>
                )}
              </>
            );

            const style = { "--tint": p.accent };

            if (p.internal) {
              return (
                <Link
                  key={p.title}
                  href={p.href}
                  className={`${styles.card} ${styles.cardFeature}`}
                  style={style}
                >
                  {inner}
                </Link>
              );
            }

            if (p.href) {
              return (
                <a
                  key={p.title}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                  style={style}
                >
                  {inner}
                </a>
              );
            }

            return (
              <div key={p.title} className={styles.card} style={style}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
