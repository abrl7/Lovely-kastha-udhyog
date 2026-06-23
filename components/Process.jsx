const steps = [
  {
    num: "i.",
    title: "Timber Selection",
    text: "We hand-pick every plank for grain and strength before it ever touches a saw.",
  },
  {
    num: "ii.",
    title: "Shaping & Joinery",
    text: "Traditional joints, cut by craftsmen who've done this for decades, not just a nail gun.",
  },
  {
    num: "iii.",
    title: "Hand Finishing",
    text: "Sanded, oiled, and polished by hand until the grain speaks for itself.",
  },
  {
    num: "iv.",
    title: "Delivered to You",
    text: "Carefully packed and delivered, with care instructions so it lasts generations.",
  },
];

export default function Process() {
  return (
    <section id="process" className="bg-cream-soft py-[6.5rem] px-[6vw]">
      <div className="max-w-[620px] mb-[3.5rem]">
        <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-sienna">
          How It&apos;s Made
        </span>
        <h2 className="font-serif font-medium text-[clamp(1.9rem,3.4vw,2.7rem)] text-walnut-deep mt-[0.6rem]">
          From timber to your living room
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[2rem]">
        {steps.map((s) => (
          <div key={s.num}>
            <span className="block font-serif italic text-[1.1rem] text-brass mb-[0.8rem]">
              {s.num}
            </span>
            <h4 className="font-serif font-medium text-[1.2rem] text-walnut-deep mb-[0.5rem]">
              {s.title}
            </h4>
            <p className="text-[0.9rem] text-[#6b5f50]">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
