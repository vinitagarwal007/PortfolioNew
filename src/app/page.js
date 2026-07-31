import BootScreen from "./components/BootScreen";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Principles from "./components/Principles";
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
      <BootScreen />
      <Nav />
      <main>
        <Hero />
        <Principles />
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
