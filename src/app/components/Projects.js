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
            const body = (
              <>
                <div className={styles.top}>
                  <span className={styles.context}>{p.context}</span>
                  {p.href && (
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
              </>
            );

            const style = { "--tint": p.accent };

            // A card carrying its own buttons can't itself be a link.
            if (p.links) {
              return (
                <div
                  key={p.title}
                  className={`${styles.card} ${styles.cardFeature}`}
                  style={style}
                >
                  {body}
                  <div className={styles.ctaRow}>
                    {p.links.map((l) => (
                      <Link key={l.href} href={l.href} className={styles.cta}>
                        {l.label}
                        <ArrowIcon width={15} height={15} />
                      </Link>
                    ))}
                  </div>
                </div>
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
                  {body}
                </a>
              );
            }

            return (
              <div key={p.title} className={styles.card} style={style}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
