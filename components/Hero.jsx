"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const bgRef = useRef(null);

  // Parallax: move background at 40% of scroll speed
  useEffect(() => {
    function onScroll() {
      if (!bgRef.current) return;
      bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.42] saturate-[1.05] will-change-transform"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=1600&q=80')",
          top: "-15%",
          bottom: "-15%",
        }}
      />

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

      <div className="relative z-10 px-[6vw] max-w-[760px] text-cream-soft">
        <span
          className="hero-line block text-[0.72rem] font-semibold tracking-[0.22em] uppercase text-brass mb-[1.4rem]"
          style={{ animationDelay: "0.1s" }}
        >
          Handcrafted Since Generations
        </span>

        <h1 className="font-serif font-light leading-[1.05] mb-[1.6rem]">
          <span
            className="hero-line block text-[clamp(2.6rem,6vw,4.6rem)]"
            style={{ animationDelay: "0.25s" }}
          >
            Furniture built
          </span>
          <span
            className="hero-line block text-[clamp(2.6rem,6vw,4.6rem)]"
            style={{ animationDelay: "0.4s" }}
          >
            the way{" "}
            <em className="font-semibold text-brass not-italic">wood</em>
          </span>
          <span
            className="hero-line block text-[clamp(2.6rem,6vw,4.6rem)]"
            style={{ animationDelay: "0.55s" }}
          >
            wants to be built.
          </span>
        </h1>

        <p
          className="hero-line text-[1.05rem] text-cream-soft/85 max-w-[520px] mb-[2.4rem]"
          style={{ animationDelay: "0.7s" }}
        >
          Every table, bed, and cabinet leaving our workshop is shaped by
          hand, season by season, from timber we choose ourselves. No
          shortcuts, no particleboard — just solid wood and the patience to
          do it right.
        </p>

        <div
          className="hero-line flex flex-col sm:flex-row gap-3 sm:gap-0"
          style={{ animationDelay: "0.85s" }}
        >
          <a
            href="/custom"
            className="inline-block text-center font-semibold text-[0.85rem] tracking-[0.04em] px-[2.1rem] py-[0.95rem] rounded-sm bg-sienna text-cream-soft hover:bg-sienna-dark transition-colors duration-200"
          >
            Request a Quote
          </a>
          <a
            href="#featured"
            className="inline-block text-center font-semibold text-[0.85rem] tracking-[0.04em] px-[2.1rem] py-[0.95rem] rounded-sm border-[1.5px] border-cream-soft/50 text-cream-soft sm:ml-[0.9rem] hover:border-cream-soft hover:bg-cream-soft/10 transition-colors duration-200"
          >
            See Our Work
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-line absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-soft/50"
        style={{ animationDelay: "1.1s" }}
      >
        <span className="text-[0.65rem] tracking-[0.18em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-cream-soft/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
