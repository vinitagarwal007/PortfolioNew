import styles from './Card.module.css'
import Image from 'next/image'
export default function Overview({image,title}){
    return(
        <div className={styles.cardWrap}>
            <div className={styles.card}>
                <Image src={image} className={styles.image} alt='framworkIcon'></Image>
                <label className={styles.titleText}>{title}</label>
            </div>
        </div>
    )
}