import styles from './Overview.module.css'
import Card from './components/Card'
import '../../../../public/icon/icon'
import { nodeJsIcon, pythonIcon, reactIcon, visualStudioIcon } from '../../../../public/icon/icon'
export default function Overview(){
    return (
      <>
        <div className={styles.Overview}>
          <label className={styles.header}>INTRODUCTION</label>
          <label className={styles.header2}>Overview.</label>
          <p className={styles.description}>
            I’m a skilled software developer with experience in Java,
            JavaScript, and have worked with frameworks like ReactJs, Node.js,
            Android Studio. I’m a quick learner and collaborate closely with
            clients to create efficient, scalable and user-friendly solutions
            that solve real-world problems, Let’s work together to bring your
            ideas to life!
          </p>
          <br></br>
          <div className={styles.cardholder}>
            <Card image={reactIcon} title={"Frontend Developer"} />
            <Card image={nodeJsIcon} title={"Backend Developer"} />
            <Card image={pythonIcon} title={"Python Developer"} />
            <Card image={visualStudioIcon} title={"Software Developer"} />
          </div>
        </div>
      </>
    );
}