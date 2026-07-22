import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomOrderClient from "@/components/CustomOrderClient";
import { getAllActiveProducts } from "@/lib/data";

export const metadata = {
  title: "Custom Order",
  description:
    "Want something specific? Describe the piece, share your measurements and wood preference, and we'll build it by hand just for you.",
  openGraph: {
    title: "Custom Furniture Order — Lovely Kastha Udhog",
    description:
      "Tell us what you have in mind. We build custom solid wood furniture to your exact measurements and style.",
    url: "/custom",
    type: "website",
  },
};

export default async function CustomPage({ searchParams }) {
  // Show ALL active products (ready-made AND reference-only) as
  // inspiration pieces so a customer arriving from the catalog can
  // still see and select the item they came from.
  const allProducts = await getAllActiveProducts();

  // Pre-select a reference product if ?reference=<id> is in the URL.
  // The catalog's "Use as Reference" button and the detail modal both link here.
  const referenceId = searchParams?.reference || null;
  const initialReference = referenceId
    ? (allProducts.find((p) => String(p._id) === String(referenceId)) ?? null)
    : null;

  return (
    <main>
      <Header />
      <div className="pt-28 px-[6vw] pb-0">
        <div className="max-w-[620px] mb-10">
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-sienna">
            Custom Orders
          </span>
          <h1 className="font-serif font-medium text-[clamp(2rem,3.5vw,2.8rem)] text-walnut-deep mt-2">
            Tell us what you have in mind
          </h1>
          <p className="text-charcoal/70 mt-3">
            Every custom piece starts with a conversation. Fill in what
            you&apos;re looking for — the kind of piece, your rough dimensions,
            wood preference — and we&apos;ll be in touch to talk through the
            details before anything is built.
          </p>
        </div>
      </div>

      <CustomOrderClient products={allProducts} initialReference={initialReference} />

      <Footer />
    </main>
  );
}
