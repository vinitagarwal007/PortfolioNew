import styles from './Navbar.module.css'
import Link from 'next/link'
export default function (){
    return(
        <div className = {styles.navbar}>
            <Link href='/' className={styles.navbarMain}><p>Vinit.</p></Link>
            <div className={styles.navbarElementHolder}>       
                <Link href='/' className={styles.navbarElement}>Home</Link>
                <Link href='#overview' className={styles.navbarElement}>About</Link>
                <Link href='#work' className={styles.navbarElement}>Work</Link>
                <Link href='/' className={styles.navbarElement}>Resume</Link>
                <Link href='/' className={styles.navbarElement}>Contact</Link>
            </div>
        </div>
    )
}