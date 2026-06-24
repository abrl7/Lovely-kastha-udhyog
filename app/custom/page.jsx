import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Inquiry from "@/components/Inquiry";
import ReferenceGrid from "@/components/ReferenceGrid";
import { getAllActiveProducts } from "@/lib/data";

export const metadata = {
  title: "Custom Order — Lovely Kastha Udhog",
  description:
    "Describe what you want. We build it by hand, to your measurements and wood preference.",
};

export default async function CustomPage({ searchParams }) {
  // Show ALL active products (ready-made AND reference-only) as
  // inspiration pieces. A customer coming from the catalog clicked a
  // ready-made item — that item is ready_made, not reference_only, so
  // using getReferenceProducts() would mean it never appears in the
  // grid and the highlight never fires. getAllActiveProducts() fixes that.
  const allProducts = await getAllActiveProducts();

  // The product ID passed via ?reference=<id> from the catalog "Inquire"
  // link — used to highlight that specific tile in the grid.
  const referenceId = searchParams?.reference || null;

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
            you&apos;re looking for — the kind of piece, your dimensions,
            wood preference — and we&apos;ll be in touch to talk through
            the details before anything is built.
          </p>
        </div>
      </div>

      {allProducts.length > 0 && (
        <div className="px-[6vw] mb-16">
          <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-charcoal/40 mb-5">
            {referenceId
              ? "Your selected reference piece is highlighted below"
              : "Browse for inspiration — or describe your own idea below"}
          </p>
          <ReferenceGrid
            products={allProducts}
            highlightedId={referenceId}
          />
        </div>
      )}

      <Inquiry />
      <Footer />
    </main>
  );
}
