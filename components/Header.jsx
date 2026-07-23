"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Ready-Made", href: "/catalog" },
  { label: "Custom Order", href: "/custom" },
  { label: "Track Order", href: "/track" },
  { label: "Our Story", href: "/#story" },
  { label: "Contact", href: "/#inquiry" },
];

export default function Header() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome   = pathname === "/";

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 72); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the homepage: transparent + white text until scrolled, then cream + dark text
  // On other pages: always cream + dark text
  const transparent = isHome && !scrolled && !isOpen;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[4vw] py-[1.4rem] transition-all duration-300 ${
        transparent
          ? "bg-transparent border-transparent"
          : "bg-cream-soft/95 backdrop-blur-md border-b border-charcoal/10 shadow-sm"
      }`}>
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight" onClick={() => setIsOpen(false)}>
          <span className={`font-serif font-semibold text-[1.1rem] sm:text-xl transition-colors duration-300 ${transparent ? "text-cream-soft" : "text-walnut-deep"}`}>
            Lovely Kastha Udhog
          </span>
          <small className={`text-[0.58rem] sm:text-[0.62rem] tracking-[0.12em] uppercase mt-0.5 transition-colors duration-300 ${transparent ? "text-brass/80" : "text-brass"}`}>
            लाभली काष्ठ उद्योग · Est. Family Workshop
          </small>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-[2.2rem]">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-[0.85rem] font-medium relative pb-1 group transition-colors duration-300 ${transparent ? "text-cream-soft/90 hover:text-cream-soft" : "text-charcoal hover:text-walnut-deep"}`}
                >
                  {label}
                  <span className={`absolute left-0 bottom-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${transparent ? "bg-brass" : "bg-sienna"}`} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Burger button — mobile only */}
        <button
          className={`md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-sm transition-colors duration-150 ${transparent ? "hover:bg-white/10" : "hover:bg-walnut/8"}`}
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span className={`block w-6 h-[2px] rounded-full transition-all duration-300 origin-center ${transparent ? "bg-cream-soft" : "bg-walnut-deep"} ${isOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-6 h-[2px] rounded-full transition-all duration-300 ${transparent ? "bg-cream-soft" : "bg-walnut-deep"} ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-6 h-[2px] rounded-full transition-all duration-300 origin-center ${transparent ? "bg-cream-soft" : "bg-walnut-deep"} ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </header>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-walnut-deep/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel — slides down from header */}
      <nav
        className={`fixed top-[73px] left-0 right-0 z-[95] bg-cream-soft border-b border-charcoal/10 shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <ul className="px-[4vw] py-2 flex flex-col">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center py-4 text-[1rem] font-medium text-walnut-deep border-b border-walnut/10 last:border-b-0 hover:text-sienna transition-colors duration-150"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA buttons at bottom of mobile menu */}
        <div className="px-[4vw] pb-5 pt-2 flex gap-3">
          <Link
            href="/catalog"
            onClick={() => setIsOpen(false)}
            className="flex-1 text-center py-3 text-sm font-semibold bg-sienna text-cream-soft rounded-sm hover:bg-sienna-dark transition-colors duration-150"
          >
            Browse Catalog
          </Link>
          <Link
            href="/custom"
            onClick={() => setIsOpen(false)}
            className="flex-1 text-center py-3 text-sm font-semibold border border-walnut/25 text-walnut-deep rounded-sm hover:bg-cream transition-colors duration-150"
          >
            Custom Order
          </Link>
        </div>
      </nav>
    </>
  );
}
