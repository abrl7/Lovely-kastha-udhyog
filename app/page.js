import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GrainBand from "@/components/GrainBand";
import Categories from "@/components/Categories";
import Featured from "@/components/Featured";
import Story from "@/components/Story";
import Process from "@/components/Process";
import Inquiry from "@/components/Inquiry";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <GrainBand />
      <Categories />
      <Featured />
      <Story />
      <Process />
      <Inquiry />
      <Footer />
    </main>
  );
}
