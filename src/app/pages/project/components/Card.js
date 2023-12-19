import { githubIcon } from "../../../../../public/icon/icon";
import styles from "./Card.module.css";
import Image from "next/image";
export default function Overview({ image, title, desc }) {
  return (
    <div className={styles.cardWrap}>
      <div className={styles.card}>
        <img src={image} className={styles.image} ></img>
        <div className={styles.textBox}>
          <div className={styles.titleBox}>
            <label className={styles.titleText}>{title}</label>
            <label className={styles.titleDesc}>{desc}</label>
          </div>
          <div className={styles.tagBox}>
            <div className={styles.tag}>{desc}</div>
            <Image className={styles.githubLink} src={githubIcon} alt="githubIcon" />
          </div>
        </div>
      </div>
    </div>
  );
}
