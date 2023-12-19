import styles from "./Navbar.module.css";
import Link from "next/link";
export default function ({selection}) {
  return (
    <div className={styles.navbar}>
      <Link href="/" className={styles.navbarMain}>
        <p>Vinit.</p>
      </Link>
      <div className={styles.navbarElementHolder}>
        <Link
          href="/"
          className={`${styles.navbarElement} ${
            selection === 1 ? styles.selected : null
          }`}
        >
          Home
        </Link>
        <Link
          href="#overview"  
          className={`${styles.navbarElement} ${
            selection === 2 ? styles.selected : null
          }`}
        >
          About
        </Link>
        <Link
          href="#work"
          className={`${styles.navbarElement} ${
            selection === 3 ? styles.selected : null
          }`}
        >
          Work
        </Link>
        <Link
          href="/"
          className={`${styles.navbarElement}`}
        >
          Resume
        </Link>
        <Link
          href="/"
          className={`${styles.navbarElement} ${
            selection === 4 ? styles.selected : null
          }`}
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
