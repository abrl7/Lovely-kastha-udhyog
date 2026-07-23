export const dynamic = "force-dynamic";

export const metadata = {
  title: "Handcrafted Wood Furniture — Made in Nepal",
  description:
    "Lovely Kastha Udhog crafts solid wood furniture by hand — living room, bedroom, dining, office, and fully custom pieces built to your measurements.",
  openGraph: {
    title: "Lovely Kastha Udhog — Handcrafted Wood Furniture",
    description:
      "Solid wood furniture, hand-built in Nepal. Ready-made pieces and fully custom orders.",
    url: "/",
    type: "website",
  },
};

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GrainBand from "@/components/GrainBand";
import Categories from "@/components/Categories";
import Featured from "@/components/Featured";
import Story from "@/components/Story";
import CraftsmanPortrait from "@/components/CraftsmanPortrait";
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
    <main className="page-enter">
      <Header />
      <Hero />
      <GrainBand />
      <Categories />
      <Featured products={featuredProducts} />
      <Story />
      <CraftsmanPortrait />
      <Process />
      <Inquiry />
      <Footer />
    </main>
  );
}
