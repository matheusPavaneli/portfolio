import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

const Minigame = dynamic(() => import("@/components/Minigame").then((m) => ({ default: m.Minigame })), {
  ssr: false,
  loading: () => <div className="py-44 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-fg-muted/10" />,
});

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Education />
      <Skills />
      <Minigame />
      <Projects />
      <Contact />
    </>
  );
}
