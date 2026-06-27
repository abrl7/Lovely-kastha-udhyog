export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.42] saturate-[1.05]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=1600&q=80')",
        }}
      />
      <div className="relative z-10 px-[6vw] max-w-[720px] text-cream-soft">
        <span className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass mb-[1.2rem]">
          Handcrafted Since Generations
        </span>
        <h1 className="font-serif font-light text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.05] mb-[1.4rem]">
          Furniture built
          <br />
          the way <em className="italic font-semibold text-brass not-italic">wood</em>
          <br />
          wants to be built.
        </h1>
        <p className="text-[1.05rem] text-cream-soft/85 max-w-[520px] mb-[2.2rem]">
          Every table, bed, and cabinet leaving our workshop is shaped by
          hand, season by season, from timber we choose ourselves. No
          shortcuts, no particleboard — just solid wood and the patience to
          do it right.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
          <a
            href="#inquiry"
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
    </section>
  );
}
