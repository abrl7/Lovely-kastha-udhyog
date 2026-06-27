import Image from "next/image";

const stats = [
  { num: "25+", label: "Years of Craft" },
  { num: "1,200+", label: "Homes Furnished" },
  { num: "100%", label: "Solid Wood" },
];

export default function Story() {
  return (
    <section
      id="story"
      className="bg-walnut-deep text-cream grid md:grid-cols-2 items-center gap-16 py-[7rem] px-[6vw]"
    >
      <div className="relative h-[320px] md:h-[480px] rounded-sm overflow-hidden order-2 md:order-1">
        {/* <Image
          src="https://images.unsplash.com/photo-1565374881-b8fc7f6a3a8b?w=700&q=80"
          alt="Carpenter working wood"
          fill
          className="object-cover saturate-[1.05]"
        /> */}
        {<Image
  src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&q=80"
  width={700}
  height={500}
  alt="Furniture"
/>}
      </div>
      <div className="order-1 md:order-2">
        <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass">
          Our Story
        </span>
        <h2 className="font-serif font-normal text-[clamp(1.9rem,3.2vw,2.6rem)] mt-[0.7rem] mb-[1.5rem] leading-tight">
          A family workshop, three generations of hands.
        </h2>
        <p className="text-cream/80 mb-[1.1rem] max-w-[480px]">
          Lovely Kastha Udhog started as a single workbench and a promise:
          never sell a piece we wouldn&apos;t put in our own home. That
          promise hasn&apos;t changed, even as the workshop has grown.
        </p>
        <p className="text-cream/80 mb-[1.1rem] max-w-[480px]">
          Today the same care goes into every joint — selecting the timber
          ourselves, air-drying it the traditional way, and finishing each
          piece by hand instead of rushing it through a machine line.
        </p>
        <div className="flex gap-[2.4rem] mt-[2.2rem] flex-wrap">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-serif text-2xl text-brass font-semibold">
                {s.num}
              </div>
              <div className="text-[0.78rem] text-cream/65">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
