import styles from "./Landing.module.css";
import Image from "next/image";
import hero from "../../../../public/hero/hero.png";
import { instagramIcon, githubIcon, lindedinIcon } from "../../../../public/icon/icon";
import ReactRotatingText from 'react-rotating-text';
export default function Landing() {
    
  return (
    <>
      <div className={styles.Landing}>
        <div className={styles.rightPartitionLanding}>
          <div className={styles.line}>
            <div className={styles.circle}></div>
          </div>
          <div className={`${styles.textColorWhite} ${styles.headingHolder}`}>
            <div>
              <p className={styles.heading}>
                Hi, I’m{" "}
                <br className={styles.break}/><span className={`${styles.textColor1} ${styles.name}`}>
                  Vinit Agarwal
                </span>
              </p>
              <p className={styles.headingDesc}>
                I am a{" "}
                <span>
                  <ReactRotatingText
                    items={[
                      "Programmer",
                      "Enthusiast",
                      "Full Stack Developer",
                    ]}
                  />
                </span>
                ,
              </p>
            </div>
            <div>
              <button className={styles.button}>Resume</button>
              <button className={`${styles.button} ${styles.buttonOutline}`}>
                Let’s Talk
              </button>
            </div>
            <div className={styles.iconContainer}>
                <Image className={styles.icon} src={githubIcon} />
                <Image className={styles.icon} src={instagramIcon} />
                <Image className={styles.icon} src={lindedinIcon} />
            </div>
          </div>
        </div>
        <div className={styles.leftPartitionLanding} id="left">
          <div className={styles.heroContainer}>
            <Image className={styles.hero} src={hero} id="image" />
          </div>
        </div>
      </div>
    </>
  );
}
