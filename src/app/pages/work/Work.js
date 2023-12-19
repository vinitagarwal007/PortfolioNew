import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import styles from "./Work.module.css";
import Image from "next/image";
import { driveToImage } from "@/app/utils/drivelink";
import workData from "@/data/work.json";
import { useRouter } from "next/router";
export default function Work({innerRef}) {
  const router = useRouter()
  return (
    <div className={styles.work} ref={innerRef}>
      <label className={styles.header}>WHAT HAVE I DONE</label>
      <label className={styles.header2}>Work Experience.</label>
      <div className={styles.timelineContainer}>
        <VerticalTimeline lineColor="#ffffff" className={styles.timeline}>
          {workData.map((e, idx) => (
            <VerticalTimelineElement
              key={idx}
              className={styles.timelineElement}
              date={e.date}
              dateClassName={styles.timelineElementDate}
              contentStyle={{ backgroundColor: "#181542" }}
              icon={
                <Image
                  className={styles.timelineElementIcon}
                  fill={true}
                  src={driveToImage(e.icon)}
                  alt="Icon"
                  sizes="33vw"

                ></Image>
              }
              iconOnClick={()=>{router.push(e.website)}}
              visible={true}
            >
              <div className={styles.timelineElementContent}>
                <h1>{e.position}</h1>
                <h2 onClick={()=>{router.push(e.website)}}>{e.company}</h2>
                <ul className={styles.timelineElementContentList}>
                  {e.work.map((e,idx)=>{
                    return <li key={idx}>{e}</li>
                  })}
                </ul>
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
}
