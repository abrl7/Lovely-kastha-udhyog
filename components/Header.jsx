import Link from "next/link";

const NAV_LINKS = [
  { label: "Ready-Made", href: "/catalog" },
  { label: "Custom Order", href: "/custom" },
  { label: "Track Order", href: "/track" },
  { label: "Our Story", href: "/#story" },
  { label: "Contact", href: "/#inquiry" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[4vw] py-[1.4rem] bg-cream-soft/90 backdrop-blur-md border-b border-charcoal/10">
      <Link href="/" className="flex flex-col leading-tight">
        <span className="font-serif font-semibold text-xl text-walnut-deep">
          Lovely Kastha Udhog
        </span>
        <small className="text-[0.62rem] tracking-[0.12em] uppercase text-brass mt-0.5">
          लाभली काष्ठ उद्योग · Est. Family Workshop
        </small>
      </Link>
      <nav className="hidden md:block">
        <ul className="flex gap-[2.2rem]">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-[0.85rem] font-medium relative pb-1 group"
              >
                {label}
                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-sienna transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
