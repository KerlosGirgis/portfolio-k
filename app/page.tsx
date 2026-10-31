import { About } from "@/components/about";
import { Apps } from "@/components/apps/apps";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero/hero";
import { Intro } from "@/components/intro";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { Toolbox } from "@/components/toolbox";
import { Websites } from "@/components/websites/websites";

export default function Home() {
  return (
    <>
      <Intro />
      <ScrollProgress />
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Apps />
        <Websites />
        <Toolbox />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
