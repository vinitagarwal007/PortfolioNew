import styles from "./Footer.module.css";
import { profile } from "@/data/site";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div>
          <p className={styles.name}>{profile.name}</p>
          <p className={styles.line}>
            Built with Next.js, a canvas element and no chart libraries.
          </p>
        </div>

        <div className={styles.right}>
          <a href="#top">Back to top ↑</a>
          <span className={styles.year}>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
