"use client";
import { useState } from "react";
import styles from "./Experience.module.css";
import { experience, education, skills } from "@/data/site";
import { ExternalIcon } from "./icons";

export default function Experience() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section" id="work">
      <div className="wrap">
        <p className="eyebrow">Track record</p>
        <h2 className="h2">Where I&apos;ve been shipping.</h2>
        <p className="lede">
          Three years of backend work, the last two spent inside a CPaaS stack
          where the failure modes are other people&apos;s money.
        </p>

        <div className={styles.timeline}>
          {experience.map((job, i) => {
            const isOpen = open === i;
            return (
              <article
                key={`${job.company}-${job.date}`}
                className={`${styles.item} ${isOpen ? styles.open : ""}`}
              >
                <div className={styles.rail}>
                  <span
                    className={`${styles.marker} ${job.current ? styles.now : ""}`}
                  />
                </div>

                <div className={styles.body}>
                  <button
                    className={styles.head}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.headText}>
                      <h3>
                        {job.role}
                        <span className={styles.at}>@</span>
                        {job.website ? (
                          <a
                            href={job.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={styles.company}
                          >
                            {job.company}
                            <ExternalIcon width={13} height={13} />
                          </a>
                        ) : (
                          <span className={styles.company}>{job.company}</span>
                        )}
                      </h3>
                      <p className={styles.date}>
                        {job.date}
                        {job.current && <b className={styles.badge}>current</b>}
                      </p>
                    </div>
                    <span className={styles.toggle} aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div className={styles.content} hidden={!isOpen}>
                    <ul className={styles.points}>
                      {job.points.map((p, k) => (
                        <li key={k}>{p}</li>
                      ))}
                    </ul>
                    <div className={styles.stack}>
                      {job.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.grid}>
          <div className={`card ${styles.edu}`}>
            <p className={styles.blockLabel}>Education</p>
            <h4>{education.degree}</h4>
            <p className={styles.school}>{education.school}</p>
            <p className={styles.date}>{education.date}</p>
            <ul className={styles.extras}>
              {education.extras.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>

          <div className={`card ${styles.skills}`}>
            <p className={styles.blockLabel}>Toolbox</p>
            <div className={styles.skillGroups}>
              {skills.map((g) => (
                <div key={g.group} className={styles.skillGroup}>
                  <span className={styles.groupName}>{g.group}</span>
                  <div className={styles.groupItems}>
                    {g.items.map((i) => (
                      <span key={i} className="chip">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
