import styles from "./Landing.module.css";
import Image from "next/image";
import hero from "../../../../public/hero/hero.png";
import { instagramIcon, githubIcon, lindedinIcon, mailIcon } from "../../../../public/icon/icon";
import ReactRotatingText from 'react-rotating-text';
export default function Landing({innerRef,contactRef}) {
    
  return (
    <>
      <div className={styles.Landing} ref={innerRef}>
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
              <a target="_blank" href="https://drive.google.com/file/d/1O2QuGhC27nJWt_5Z6CVi7_ILPmyZI6LE/view?usp=drive_link"><button className={styles.button}>Resume</button></a>
              <button className={`${styles.button} ${styles.buttonOutline}`} onClick={()=>{
                contactRef.current.scrollIntoView()
              }}>
                Let’s Talk
              </button>
            </div>
            <div className={styles.iconContainer}>
                <a href="https://github.com/vinitagarwal007" target="_blank"><Image className={styles.icon} alt="githudIcon" src={githubIcon} /></a>
                <a href="mailto:vinitagarwal.garg@gmail.com" target="_blank"><Image className={styles.icon} alt="instagramIcon" src={mailIcon} /></a>
                <a href="https://linkedin.com/in/vinit-agarwal007" target="_blank"><Image className={styles.icon} alt="linkedInIcon" src={lindedinIcon} /></a>
            </div>
          </div>
        </div>
        <div className={styles.leftPartitionLanding} id="left">
          <div className={styles.heroContainer}>
            <Image className={styles.hero} src={hero} alt="heroImg" id="image" />
          </div>
        </div>
      </div>
    </>
  );
}
