"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./Nav.module.css";
import useActiveSection from "../hooks/useActiveSection";
import { profile } from "@/data/site";

const LINKS = [
  { id: "approach", label: "Approach" },
  { href: "/systems", label: "Systems", route: true },
  { id: "framework", label: "Framework" },
  { id: "work", label: "Path" },
  { id: "engineering", label: "Notes" },
  { id: "arcade", label: "Arcade" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const ids = useMemo(() => LINKS.filter((l) => !l.route).map((l) => l.id), []);
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderLink = (l, onClick) =>
    l.route ? (
      <Link href={l.href} className={styles.routeLink} onClick={onClick}>
        {l.label}
        <span className={styles.routeMark} aria-hidden="true">
          ↗
        </span>
      </Link>
    ) : (
      <a
        href={`#${l.id}`}
        className={active === l.id ? styles.active : ""}
        onClick={onClick}
      >
        {l.label}
      </a>
    );

  return (
    <header className={`${styles.header} ${scrolled ? styles.solid : ""}`}>
      <nav className={styles.nav}>
        <a href="#top" className={styles.brand}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.brandText}>vinit</span>
          <span className={styles.brandDim}>.sys</span>
        </a>

        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.label}>{renderLink(l)}</li>
          ))}
        </ul>

        <div className={styles.right}>
          <a
            className={styles.resume}
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé
          </a>
          <button
            className={styles.burger}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={open ? styles.barTop : ""} />
            <span className={open ? styles.barMid : ""} />
            <span className={open ? styles.barBot : ""} />
          </button>
        </div>
      </nav>

      {open && (
        <ul className={styles.mobileMenu}>
          {LINKS.map((l, i) => (
            <li key={l.label}>
              <span className={styles.mobileIdx}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {renderLink(l, () => setOpen(false))}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
