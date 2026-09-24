import styles from "./page.module.css";
import ThemeToggle from "./ThemeToggle";
import { profile, stats, deepDives, experience, skills } from "@/data/site";

const NAV = [
  { href: "#systems", label: "Notes" },
  { href: "#path", label: "Path" },
  { href: "#contact", label: "Contact" },
];

const SYSTEMS = ["registry", "debounce", "throttle", "reports"].map((id) =>
  deepDives.find((d) => d.id === id)
);

const TOOLBOX = [
  "Async Python, at volume",
  "Correctness",
  "Storage & transport",
].map((group) => skills.find((g) => g.group === group));

const SOCIALS = [
  { href: profile.socials.github, label: "GitHub" },
  { href: profile.socials.linkedin, label: "LinkedIn" },
  { href: profile.socials.medium, label: "Medium" },
];

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <div className={`wrap ${styles.headerInner}`}>
          <p className={styles.name}>{profile.name}</p>
          <div className={styles.headerEnd}>
            <nav aria-label="Primary">
              <ul className={styles.nav}>
                {NAV.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
                <li>
                  <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                    Résumé
                  </a>
                </li>
              </ul>
            </nav>
            <ThemeToggle className={styles.toggle} />
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={`wrap ${styles.stack}`}>
            <p className="label">
              {profile.role} · {profile.location}
            </p>
            <h1 id="hero-title" className={styles.claim}>
              {profile.headline}
            </h1>
            <p className={styles.lede}>{profile.plain}</p>
            <p className={styles.links}>
              <a href="#systems">Selected work</a>
              <a href="#contact">Get in touch</a>
            </p>
          </div>
        </section>

        <section className={styles.metrics}>
          <dl className={`wrap ${styles.metricGrid}`}>
            {stats.map((s) => (
              <div key={s.label} className={styles.metric}>
                <dt className="label">{s.label}</dt>
                <dd className={styles.figure}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="systems" className={styles.section} aria-labelledby="systems-title">
          <div className={`wrap ${styles.stack}`}>
            <p className="label">Engineering notes</p>
            <h2 id="systems-title">Problems I&apos;ve had to think hard about.</h2>
            <ul className={styles.cards}>
              {SYSTEMS.map((d) => (
                <li key={d.id} className={styles.card}>
                  <p className="label">{d.tag}</p>
                  <h3>{d.title}</h3>
                  <p>{d.problem}</p>
                  <p className={styles.metricLine}>{d.metric}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="path" className={`${styles.section} ${styles.ruled}`} aria-labelledby="path-title">
          <div className={`wrap ${styles.stack}`}>
            <p className="label">The path so far</p>
            <h2 id="path-title">Where I learned all this.</h2>
            <ol className={styles.path}>
              {experience.map((job) => (
                <li key={`${job.company}-${job.role}`} className={styles.row}>
                  <div className={styles.rowMain}>
                    <h3>{job.role}</h3>
                    <p className="label">{job.company}</p>
                    {job.current && <p className={styles.rowNote}>{job.points[0]}</p>}
                  </div>
                  <p className={`label ${styles.date}`}>{job.date}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="toolbox-title">
          <div className={`wrap ${styles.stack}`}>
            <h2 id="toolbox-title" className="label">
              Toolbox
            </h2>
            <div className={styles.toolbox}>
              {TOOLBOX.map((g) => (
                <div key={g.group} className={styles.group}>
                  <h3>{g.group}</h3>
                  <ul className={styles.tags}>
                    {g.items.map((item) => (
                      <li key={item} className={styles.tag}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className={`${styles.section} ${styles.ruled}`} aria-labelledby="contact-title">
          <div className={`wrap ${styles.stack}`}>
            <p className="label">Get in touch</p>
            <h2 id="contact-title">If you&apos;re building something that has to stay up.</h2>
            <p className={styles.lede}>
              I&apos;m happiest near the queue, the retry policy and the part everyone
              else is quietly nervous about. Whether you&apos;re hiring, building
              something together, or just want to argue about abstractions — I read
              everything and I reply.
            </p>
            <a className={styles.email} href={profile.socials.mail}>
              {profile.email}
            </a>
            <dl className={styles.meta}>
              <div className={styles.pair}>
                <dt className="label">Based in</dt>
                <dd>{profile.location}</dd>
              </div>
              <div className={styles.pair}>
                <dt className="label">Open to</dt>
                <dd>Roles, collaborations, and problems that sound hard</dd>
              </div>
            </dl>
            <ul className={styles.socials}>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`wrap ${styles.footerInner}`}>
          <p className="label">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
