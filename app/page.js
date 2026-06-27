export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GrainBand from "@/components/GrainBand";
import Categories from "@/components/Categories";
import Featured from "@/components/Featured";
import Story from "@/components/Story";
import Process from "@/components/Process";
import Inquiry from "@/components/Inquiry";
import Footer from "@/components/Footer";
import { getFeaturedProducts } from "@/lib/data";

// This is a server component (no "use client") — it runs on the server
// at request time and can call the database directly via getFeaturedProducts().
// The fetched data is passed as props to child components that need it.
export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      <Header />
      <Hero />
      <GrainBand />
      <Categories />
      <Featured products={featuredProducts} />
      <Story />
      <Process />
      <Inquiry />
      <Footer />
    </main>
  );
}
