import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Work from "./components/Work";
import { About, Capabilities, Experience, Toolkit, Process, Faq } from "./components/Sections";
import { Marquee, Contact, Footer } from "./components/Chrome";
import Reveal from "./components/Reveal";
import Tilt from "./components/Tilt";

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Capabilities />
        <Work />
        <Experience />
        <Toolkit />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Reveal />
      <Tilt />
    </>
  );
}
