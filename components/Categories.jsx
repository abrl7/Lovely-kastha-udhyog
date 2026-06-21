import Image from "next/image";

const categories = [
  {
    num: "01",
    name: "Living Room",
    img: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80",
  },
  {
    num: "02",
    name: "Bedroom",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
  },
  {
    num: "03",
    name: "Dining",
    img: "https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=600&q=80",
  },
  {
    num: "04",
    name: "Office",
    img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
  },
  {
    num: "05",
    name: "Custom Orders",
    img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80",
  },
];

export default function Categories() {
  return (
    <section id="categories" className="bg-cream py-[6.5rem] px-[6vw]">
      <div className="max-w-[620px] mb-[3.5rem]">
        <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-sienna">
          Collections
        </span>
        <h2 className="font-serif font-medium text-[clamp(1.9rem,3.4vw,2.7rem)] text-walnut-deep mt-[0.6rem]">
          Furniture for every room you live in
        </h2>
      </div>
      <div className="cat-scroll flex gap-[1.4rem] overflow-x-auto pb-[0.6rem]">
        {categories.map((cat) => (
          <div
            key={cat.num}
            className="cat-card group relative flex-none w-[280px] h-[360px] overflow-hidden rounded-sm"
          >
            <Image
              src={cat.img}
              alt={`${cat.name} wooden furniture`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,14,9,0.85)] via-[rgba(20,14,9,0.1)] via-[55%] to-transparent" />
            <div className="absolute left-[1.3rem] bottom-[1.3rem] z-[2] text-cream-soft">
              <span className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass mb-[0.3rem]">
                {cat.num}
              </span>
              <h3 className="font-serif font-medium text-[1.3rem]">
                {cat.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
