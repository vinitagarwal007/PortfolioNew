import styles from "./Card.module.css";
import Image from "next/image";
export default function Overview({
  image,
  title,
  onMouseEnter,
  onMouseLeave,
  isFront = true,
  list,
}) {
  return (
    <div
      className={styles.card}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isFront ? (
        <>
          <Image
            src={image}
            className={styles.image}
            alt="framworkIcon"
          ></Image>
          <label className={styles.titleText}>{title}</label>
        </>
      ) : (
        <div className={styles.list}>
          {list?.map((ele,idx) => {
            return (
              <div className={styles.listElement} key={idx}>
                <Image src={ele.image} className={styles.listImage}></Image>
                <span className={styles.listLabel}>{ele.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
