import styles from "./Navbar.module.css";
import Link from "next/link";
export default function ({ selection,homeRef,workRef,aboutRef,contactRef }) {
  const navButtonOnClick = (e) => {
    switch (e.target.name) {
      case "home":
        homeRef.current.scrollIntoView()
        break;
      case "work":
        workRef.current.scrollIntoView()
        break;
      case "contact":
        contactRef.current.scrollIntoView()
        break;
      case "about":
        aboutRef.current.scrollIntoView()
        break;
    
      default:
        break;
    }
  };
  return (
    <div className={styles.navbar}>
      <Link href="/" className={styles.navbarMain}>
        <p>Vinit.</p>
      </Link>
      <div className={styles.navbarElementHolder}>
        <button
          name="home"
          onClick={navButtonOnClick}
          className={`${styles.navbarElement} ${
            selection === 1 ? styles.selected : null
          }`}
        >
          Home
        </button>
        <button
          name="about"
          onClick={navButtonOnClick}
          className={`${styles.navbarElement} ${
            selection === 2 ? styles.selected : null
          }`}
        >
          About
        </button>
        <button
          name="work"
          onClick={navButtonOnClick}
          className={`${styles.navbarElement} ${
            selection === 3 ? styles.selected : null
          }`}
        >
          Work
        </button>
        <Link href="https://drive.google.com/file/d/1O2QuGhC27nJWt_5Z6CVi7_ILPmyZI6LE/view?usp=drive_link" className={`${styles.navbarElement}`}>
          Resume
        </Link>
        <button
          name="contact"
          onClick={navButtonOnClick}
          className={`${styles.navbarElement} ${
            selection === 4 ? styles.selected : null
          }`}
        >
          Contact
        </button>
      </div>
    </div>
  );
}
