import styles from "./Project.module.css";
import Card from "./components/Card";
import "../../../../public/icon/icon";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { driveToImage } from "@/app/utils/drivelink";
export default function Project({ innerRef }) {
  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 2560,
        settings: {
          slidesToShow: 3,
        },
      },
      ,
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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
            <Card
              image={driveToImage(
                "https://drive.google.com/file/d/1B0_UimZSidFG1_RT0L8Tdt8oA2niGgIr/view?usp=drive_link"
              )}
              title={"Frontend Developer"}
              desc={"Descrip"}
            />
            <Card
              image={driveToImage(
                "https://drive.google.com/file/d/1B0_UimZSidFG1_RT0L8Tdt8oA2niGgIr/view?usp=drive_link"
              )}
              title={"Frontend Developer 1"}
            />
            <Card
              image={driveToImage(
                "https://drive.google.com/file/d/1B0_UimZSidFG1_RT0L8Tdt8oA2niGgIr/view?usp=drive_link"
              )}
              title={"Frontend Developer 2"}
            />
            <Card
              image={driveToImage(
                "https://drive.google.com/file/d/1B0_UimZSidFG1_RT0L8Tdt8oA2niGgIr/view?usp=drive_link"
              )}
              title={"Frontend Developer "}
            />
          </Slider>
        </div>
      </div>
    </>
  );
}
