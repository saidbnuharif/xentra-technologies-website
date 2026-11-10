import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Leadership } from "@/components/sections/Leadership";
import { Services } from "@/components/sections/Services";
import { WhyXentra } from "@/components/sections/WhyXentra";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { MotionRoot } from "@/components/motion/MotionRoot";

/*
 * Tone sequence (deliberate, fewer hard transitions than before):
 * black hero → white About → light Founders → black Services → navy Why
 * Xentra → black Work → light Process → black Contact + footer.
 * Sections without approved content return null in production builds.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      {/* tabIndex lets the skip link move keyboard focus, not just scroll. */}
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Leadership />
        <Services />
        <WhyXentra />
        <SelectedWork />
        <Process />
        <Contact />
      </main>
      <Footer />
      {/* Last, so pinned sections above are set up before its triggers. */}
      <MotionRoot />
    </>
  );
}
