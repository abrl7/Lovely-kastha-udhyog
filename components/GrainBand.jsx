const ITEMS = [
  "Solid Wood",
  "Hand Finished",
  "Built to Outlast",
  "Made in Nepal",
  "Teak · Sal · Sheesham",
  "Custom Orders Welcome",
];

export default function GrainBand() {
  // Duplicate so the loop is seamless
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="grain-band h-14 overflow-hidden flex items-center">
      <div className="marquee-track flex items-center gap-0 whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="font-serif italic text-cream text-[0.9rem] px-6 tracking-[0.04em]">
              {item}
            </span>
            <span className="text-brass/60 text-[0.5rem]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
