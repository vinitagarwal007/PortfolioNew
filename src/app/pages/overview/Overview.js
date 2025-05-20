import styles from "./Overview.module.css";
import Card from "./components/Card";
import {
  awsIcon,
  dbIcon,
  devopsIcon,
  djangoIcon,
  dockerIcon,
  kubernetesIcon,
  mongoIcon,
  mysqlIcon,
  nextJsIcon,
  nodeJsIcon,
  postgresIcon,
  pythonIcon,
  reactIcon,
  visualStudioIcon,
} from "../../../../public/icon/icon";
import { FlipCard } from "./components/flipCard";
export default function Overview({ innerRef }) {
  return (
    <>
      <div className={styles.Overview} ref={innerRef}>
        <label className={styles.header}>INTRODUCTION</label>
        <label className={styles.header2}>Overview.</label>
        <p className={styles.description}>
          I’m a skilled software developer with experience in Java, JavaScript,
          and have worked with frameworks like ReactJs, Node.js, Django. I’m a
          quick learner and collaborate closely with clients to create
          efficient, scalable and user-friendly solutions that solve real-world
          problems, Let’s work together to bring your ideas to life!
        </p>
        <br></br>
        <div className={styles.cardholder}>
          <FlipCard
            image={reactIcon}
            title={"Frontend Developer"}
            list={[
              { text: "React.Js", image: reactIcon },
              { text: "Next.Js", image: nextJsIcon },
              { text: "Django", image: djangoIcon }
            ]}
          />
          <FlipCard
            image={nodeJsIcon}
            title={"Backend Developer"}
            list={[
              { text: "NodeJs", image: nodeJsIcon },
              { text: "Django", image: djangoIcon },
            ]}
          />
          <FlipCard
            image={dbIcon}
            title={"Database"}
            list={[
              { text: "MySql", image: mysqlIcon },
              { text: "PostgreSql", image: postgresIcon },
              { text: "MongoDB", image: mongoIcon },
            ]}
          />
          <FlipCard
            image={devopsIcon}
            title={"DevOps Engineer"}
            list={[
              { text: "Docker", image: dockerIcon },
              { text: "Kubernetes", image: kubernetesIcon },
              { text: "AWS", image: awsIcon },
            ]}
          />
        </div>
      </div>
    </>
  );
}
