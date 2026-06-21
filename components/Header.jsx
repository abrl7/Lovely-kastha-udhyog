export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[4vw] py-[1.4rem] bg-cream-soft/90 backdrop-blur-md border-b border-charcoal/10">
      <div className="flex flex-col leading-tight">
        <span className="font-serif font-semibold text-xl text-walnut-deep">
          Lovely Kastha Udhog
        </span>
        <small className="text-[0.62rem] tracking-[0.12em] uppercase text-brass mt-0.5">
          লাভলী কাষ্ঠ উদ্যোগ · Est. Family Workshop
        </small>
      </div>
      <nav className="hidden md:block">
        <ul className="flex gap-[2.2rem]">
          {[
            ["Collections", "#categories"],
            ["Featured", "#featured"],
            ["Our Story", "#story"],
            ["Process", "#process"],
            ["Contact", "#inquiry"],
          ].map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="text-[0.85rem] font-medium relative pb-1 group"
              >
                {label}
                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-sienna transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
