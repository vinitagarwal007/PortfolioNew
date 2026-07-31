import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Architecture from "./components/Architecture";
import Framework from "./components/Framework";
import Experience from "./components/Experience";
import DeepDives from "./components/DeepDives";
import Arcade from "./components/arcade/Arcade";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Architecture />
        <Framework />
        <Experience />
        <DeepDives />
        <Arcade />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
