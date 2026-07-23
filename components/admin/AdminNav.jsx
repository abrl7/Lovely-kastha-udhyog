"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/apiRequest";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Orders" },
  { href: "/admin/dashboard/products", label: "Products" },
];

export default function AdminNav({ adminName }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      router.refresh();
      router.push("/admin/login");
    }
  }

  return (
    <header className="bg-walnut-deep text-cream-soft px-4 md:px-10 py-3 md:py-4 flex items-center justify-between gap-3">
      {/* Logo + nav */}
      <div className="flex items-center gap-3 md:gap-8 min-w-0">
        <div className="shrink-0">
          {/* Full name on md+, initials on mobile */}
          <span className="font-serif text-base md:text-lg">
            <span className="hidden md:inline">Lovely Kastha Udhog</span>
            <span className="md:hidden">LKU</span>
          </span>
          <span className="text-cream-soft/50 text-xs md:text-sm ml-1 md:ml-2">Admin</span>
        </div>
        <nav className="flex gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm px-3 py-1.5 rounded-sm transition-colors duration-150 ${
                  isActive
                    ? "bg-cream-soft/15 text-cream-soft font-semibold"
                    : "text-cream-soft/65 hover:text-cream-soft hover:bg-cream-soft/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <span className="text-sm text-cream-soft/80 hidden sm:inline">
          Welcome, {adminName}
        </span>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-xs md:text-sm font-semibold border border-cream-soft/30 rounded-sm px-3 md:px-4 py-1.5 hover:bg-cream-soft/10 transition-colors duration-200 disabled:opacity-60 whitespace-nowrap"
        >
          {loggingOut ? "…" : "Sign Out"}
        </button>
      </div>
    </header>
  );
}
