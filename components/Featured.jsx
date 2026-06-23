import Image from "next/image";

const products = [
  {
    name: "Heritage Sofa Set",
    meta: "Sheesham wood · Hand-carved",
    img: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&q=80",
    className: "col-span-6 md:col-span-3 row-span-2 h-[320px] md:h-auto",
  },
  {
    name: "Riverside Dining Table",
    meta: "Seats 8 · Teak",
    img: "https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=900&q=80",
    className: "col-span-6 md:col-span-3 h-[320px] md:h-[320px]",
  },
  {
    name: "Lowland Bed Frame",
    meta: "Sal wood",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    className: "col-span-6 md:col-span-2 h-[320px] md:h-[220px]",
  },
  {
    name: "Study Desk",
    meta: "Mango wood",
    img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80",
    className: "col-span-6 md:col-span-1 h-[320px] md:h-[220px]",
  },
];

export default function Featured() {
  return (
    <section id="featured" className="py-[6.5rem] px-[6vw]">
      <div className="max-w-[620px] mb-[3.5rem]">
        <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-sienna">
          From the Workshop
        </span>
        <h2 className="font-serif font-medium text-[clamp(1.9rem,3.4vw,2.7rem)] text-walnut-deep mt-[0.6rem]">
          Recently made, recently loved
        </h2>
      </div>
      <div className="grid grid-cols-6 gap-[1.2rem]">
        {products.map((p) => (
          <div
            key={p.name}
            className={`group relative overflow-hidden rounded-sm ${p.className}`}
          >
            <Image
              src={p.img}
              alt={p.name}
              fill
              className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
            />
            <div className="absolute left-0 right-0 bottom-0 p-[1.2rem] bg-gradient-to-t from-[rgba(20,14,9,0.88)] to-transparent text-cream-soft">
              <h4 className="font-serif font-medium text-[1.15rem]">
                {p.name}
              </h4>
              <p className="text-[0.82rem] text-brass mt-[0.15rem]">
                {p.meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
