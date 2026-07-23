import Image from "next/image";
import Link from "next/link";
import FadeIn from "./FadeIn";

// Grid layout classes for up to 4 products in the asymmetric layout.
// On mobile: simple full-width stacked cards. On md+: asymmetric grid.
const GRID_CLASSES = [
  "col-span-6 md:col-span-3 h-[260px] sm:h-[320px] md:row-span-2 md:h-auto",
  "col-span-6 md:col-span-3 h-[260px] sm:h-[320px] md:h-[320px]",
  "col-span-6 md:col-span-2 h-[260px] sm:h-[320px] md:h-[220px]",
  "col-span-6 md:col-span-1 h-[260px] sm:h-[320px] md:h-[220px]",
];

// Fallback placeholder tiles shown when no featured products exist yet
// in the database — keeps the homepage looking reasonable during early
// setup before your dad has added real products.
const FALLBACKS = [
  {
    name: "Heritage Sofa Set",
    meta: "Sheesham wood · Hand-carved",
    img: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&q=80",
  },
  {
    name: "Riverside Dining Table",
    meta: "Seats 8 · Teak",
    img: "https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=900&q=80",
  },
  {
    name: "Lowland Bed Frame",
    meta: "Sal wood",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
  },
  {
    name: "Study Desk",
    meta: "Mango wood",
    img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80",
  },
];

export default function Featured({ products = [] }) {
  // Use real DB products if available, fall back to placeholders otherwise.
  const useFallback = products.length === 0;
  const items = useFallback
    ? FALLBACKS
    : products.slice(0, 4).map((p) => ({
        name: p.name,
        meta: [p.woodType, p.description].filter(Boolean).join(" · "),
        img: p.images?.[0]?.url || null,
        id: p._id,
        listingType: p.listingType,
      }));

  return (
    <section id="featured" className="py-[4rem] md:py-[6.5rem] px-[6vw]">
      <FadeIn direction="up" className="max-w-[620px] mb-[3.5rem]">
        <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-sienna">
          From the Workshop
        </span>
        <h2 className="font-serif font-medium text-[clamp(1.9rem,3.4vw,2.7rem)] text-walnut-deep mt-[0.6rem]">
          Recently made, recently loved
        </h2>
      </FadeIn>

      <FadeIn direction="in" delay="delay-100" className="grid grid-cols-6 gap-[1.2rem]">
        {items.map((item, i) => {
          const gridClass = GRID_CLASSES[i] || GRID_CLASSES[GRID_CLASSES.length - 1];
          // Ready-made items link to /catalog, reference items link to /custom
          const href = item.listingType === "ready_made" ? "/catalog" : "/custom";

          const inner = (
            <div className="group relative overflow-hidden rounded-sm w-full h-full">
              {item.img ? (
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  quality={90}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                />
              ) : (
                <div className="w-full h-full bg-cream flex items-center justify-center">
                  <span className="text-charcoal/30 text-sm">No image yet</span>
                </div>
              )}

              {/* Always-visible bottom bar */}
              <div className="absolute left-0 right-0 bottom-0 p-[1.2rem] bg-gradient-to-t from-[rgba(20,14,9,0.90)] via-[rgba(20,14,9,0.4)] to-transparent text-cream-soft transition-all duration-500 group-hover:from-[rgba(20,14,9,0.97)]">
                <h4 className="font-serif font-medium text-[1.15rem] translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  {item.name}
                </h4>
                {item.meta && (
                  <p className="text-[0.82rem] text-brass mt-[0.15rem] translate-y-1 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.meta}
                  </p>
                )}
                {/* CTA revealed on hover */}
                <p className="mt-2 text-[0.78rem] font-semibold tracking-[0.06em] uppercase text-cream-soft/0 group-hover:text-cream-soft/80 transition-all duration-300 delay-100">
                  {item.listingType === "ready_made" ? "View in catalog →" : "Use as reference →"}
                </p>
              </div>
            </div>
          );

          return (
            <div key={item.id || item.name} className={`${gridClass} relative`}>
              {/* Real products are clickable links; fallback placeholders are not */}
              {item.id ? (
                <Link href={href} className="block w-full h-full">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </FadeIn>

      {!useFallback && (
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/catalog"
            className="inline-block font-semibold text-[0.85rem] tracking-[0.04em] px-[2rem] py-[0.85rem] rounded-sm bg-sienna text-cream-soft hover:bg-sienna-dark transition-colors duration-200"
          >
            View Full Catalog
          </Link>
          <Link
            href="/custom"
            className="inline-block font-semibold text-[0.85rem] tracking-[0.04em] px-[2rem] py-[0.85rem] rounded-sm border-[1.5px] border-walnut/30 text-walnut hover:bg-cream transition-colors duration-200"
          >
            Order Something Custom
          </Link>
        </div>
      )}
    </section>
  );
}
