export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogClient from "@/components/CatalogClient";
import { getReadyMadeProducts } from "@/lib/data";

export const metadata = {
  title: "Catalog",
  description:
    "Ready-made solid wood furniture, available now from our workshop. Browse tables, wardrobes, sofas, beds and more — each piece hand-built in Nepal.",
  openGraph: {
    title: "Furniture Catalog — Lovely Kastha Udhog",
    description:
      "In-stock solid wood furniture, ready to take home. Hand-built in our Nepal workshop.",
    url: "/catalog",
    type: "website",
  },
};

export default async function CatalogPage() {
  const products = await getReadyMadeProducts();

  return (
    <main>
      <Header />
      <div className="pt-28 pb-20 px-[6vw]">
        <div className="max-w-[620px] mb-10">
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-sienna">
            Ready-Made
          </span>
          <h1 className="font-serif font-medium text-[clamp(2rem,3.5vw,2.8rem)] text-walnut-deep mt-2">
            In-stock furniture, ready to take home
          </h1>
          <p className="text-charcoal/70 mt-3">
            These pieces are built and available now. What you see is what
            you get — no waiting, no measurements needed. Each one is solid
            wood, finished by hand in our workshop.
          </p>
        </div>

        {/* CatalogClient handles the category filter tabs and renders
            the product grid. It's a client component because filtering
            involves interactive state, but the actual products were
            already fetched server-side above and passed as props — no
            extra fetch needed in the browser. */}
        <CatalogClient products={products} />
      </div>
      <Footer />
    </main>
  );
}
