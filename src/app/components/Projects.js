import styles from "./Projects.module.css";
import { projects } from "@/data/site";
import { ExternalIcon } from "./icons";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <p className="eyebrow">Selected work</p>
        <h2 className="h2">Things I&apos;ve built.</h2>
        <p className="lede">
          A production platform, plus a few older builds from the years when
          shipping anything at all felt like magic.
        </p>

        <div className={styles.grid}>
          {projects.map((p) => {
            const Tag = p.href ? "a" : "div";
            return (
              <Tag
                key={p.title}
                className={styles.card}
                style={{ "--tint": p.accent }}
                {...(p.href
                  ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
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
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
