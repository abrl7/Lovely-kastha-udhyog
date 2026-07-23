"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import FadeIn from "./FadeIn";

const stats = [
  { num: 25,    suffix: "+", label: "Years of Craft" },
  { num: 1200,  suffix: "+", label: "Homes Furnished" },
  { num: 100,   suffix: "%", label: "Solid Wood" },
];

function CountUp({ target, suffix, inView }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [inView, target]);

  return <>{count}{suffix}</>;
}

export default function Story() {
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.4 });

  return (
    <section
      id="story"
      className="bg-walnut-deep text-cream grid md:grid-cols-2 items-center gap-16 py-[7rem] px-[6vw]"
    >
      {/* Image */}
      <FadeIn direction="left" className="relative h-[320px] md:h-[480px] rounded-sm overflow-hidden order-2 md:order-1">
        <Image
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&q=80"
          alt="Furniture craftsmanship"
          fill
          className="object-cover saturate-[1.05]"
        />
        {/* Decorative corner frame */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-brass/40 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-brass/40 pointer-events-none" />
      </FadeIn>

      {/* Text */}
      <div className="order-1 md:order-2">
        <FadeIn direction="up" delay="delay-100">
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass">
            Our Story
          </span>
          <h2 className="font-serif font-normal text-[clamp(1.9rem,3.2vw,2.6rem)] mt-[0.7rem] mb-[1.5rem] leading-tight">
            A family workshop, three generations of hands.
          </h2>
        </FadeIn>

        <FadeIn direction="up" delay="delay-200">
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
        </FadeIn>

        {/* Stats — count up when in view */}
        <div ref={statsRef} className="flex gap-[2.4rem] mt-[2.2rem] flex-wrap">
          {stats.map((s, i) => (
            <div key={s.label} className={`fade-up ${statsInView ? "in-view" : ""} delay-${(i + 1) * 100}`}>
              <div className="font-serif text-3xl text-brass font-semibold">
                <CountUp target={s.num} suffix={s.suffix} inView={statsInView} />
              </div>
              <div className="text-[0.78rem] text-cream/65 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
