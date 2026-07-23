"use client";

import { useInView } from "@/hooks/useInView";
import FadeIn from "./FadeIn";

const steps = [
  {
    num: "01",
    title: "Timber Selection",
    text: "We hand-pick every plank for grain and strength before it ever touches a saw.",
  },
  {
    num: "02",
    title: "Shaping & Joinery",
    text: "Traditional joints, cut by craftsmen who've done this for decades, not just a nail gun.",
  },
  {
    num: "03",
    title: "Hand Finishing",
    text: "Sanded, oiled, and polished by hand until the grain speaks for itself.",
  },
  {
    num: "04",
    title: "Delivered to You",
    text: "Carefully packed and delivered, with care instructions so it lasts generations.",
  },
];

export default function Process() {
  const { ref: lineRef, inView: lineInView } = useInView({ threshold: 0.3 });

  return (
    <section id="process" className="bg-cream-soft py-[4rem] md:py-[6.5rem] px-[6vw]">
      <FadeIn direction="up" className="max-w-[620px] mb-[3.5rem]">
        <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-sienna">
          How It&apos;s Made
        </span>
        <h2 className="font-serif font-medium text-[clamp(1.9rem,3.4vw,2.7rem)] text-walnut-deep mt-[0.6rem]">
          From timber to your living room
        </h2>
      </FadeIn>

      {/* Connector line — only visible on md+ */}
      <div ref={lineRef} className="hidden md:block relative mb-10">
        <div className="h-px bg-walnut/10 w-full" />
        {lineInView && (
          <div className="line-fill absolute top-0 left-0 h-px bg-brass/50" />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[2rem]">
        {steps.map((s, i) => (
          <FadeIn
            key={s.num}
            direction="up"
            delay={`delay-${i * 100}`}
            className="group"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-none w-9 h-9 rounded-full border border-brass/40 flex items-center justify-center font-serif text-sm text-brass group-hover:bg-brass group-hover:text-walnut-deep transition-colors duration-300">
                {s.num}
              </span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-walnut/10 md:hidden" />
              )}
            </div>
            <h4 className="font-serif font-medium text-[1.15rem] text-walnut-deep mb-[0.5rem]">
              {s.title}
            </h4>
            <p className="text-[0.9rem] text-charcoal/65 leading-relaxed">{s.text}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
