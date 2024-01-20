import styles from "./Project.module.css";
import Card from "./components/Card";
import "../../../../public/icon/icon";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { driveToImage } from "@/app/utils/drivelink";
import projectData from "@/data/project.json";
export default function Project({ innerRef }) {
  const number_project = projectData.length;
  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 2560,
        settings: {
          slidesToShow: number_project >= 3 ? 3 : number_project,
        },
      },
      ,
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: number_project >= 2 ? 2 : number_project,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    dotsClass: "slick-dots",
  };
  return (
    <>
      <div className={styles.Project} ref={innerRef}>
        <label className={styles.header}>My Work</label>
        <label className={styles.header2}>Projects.</label>
        <p className={styles.description}>
          Following projects showcases my skills and experience thought
          real-world examples of my work. Each project is briefly described with
          the links to code repositories and live-demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </p>
        <br></br>
        <div className={styles.cardholder}>
          <Slider {...slickSettings} className={styles.Slider}>
            {projectData.map((e) => (
              <Card
                image={e.img}
                title={e.title}
                desc={e.desc}
                github={e.github}
                tag={e.tag}
              />
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}
