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
          {list?.map((ele) => {
            return (
              <div className={styles.listElement}>
                <Image src={ele.image} width={40}></Image>
                <h4 style={{width:"50%"}}>{ele.text}</h4>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
