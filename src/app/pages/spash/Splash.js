import styles from "./splash.module.css";
export default function Splash() {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.centerAnimation}>
          <div className={styles.text}>
            <label>VA</label>
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={`${styles.line} ${styles.right}`}></div>
      </div>
    </>
  );
}
