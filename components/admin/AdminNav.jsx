"use client";

import { useState } from "react";
<<<<<<< HEAD
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
=======
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/apiRequest";

export default function AdminNav({ adminName }) {
  const router = useRouter();
>>>>>>> 4d4ae4a33e2b7a2a33076289f7660c0f9c2494e9
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
<<<<<<< HEAD
=======
      // Even if the logout request itself fails for some reason, we
      // still want to send the admin back to the login page rather than
      // leaving them stuck on a dashboard whose data may now be stale —
      // logging the error is enough; it doesn't need to block navigation.
>>>>>>> 4d4ae4a33e2b7a2a33076289f7660c0f9c2494e9
      console.error("Logout request failed:", error);
    } finally {
      router.refresh();
      router.push("/admin/login");
    }
  }

  return (
    <header className="bg-walnut-deep text-cream-soft px-6 md:px-10 py-4 flex items-center justify-between">
<<<<<<< HEAD
      <div className="flex items-center gap-8">
        <div>
          <span className="font-serif text-lg">Lovely Kastha Udhog</span>
          <span className="text-cream-soft/50 text-sm ml-2">Admin</span>
        </div>
        <nav className="flex gap-1">
          {NAV_LINKS.map((link) => {
            // Mark active: exact match for Orders (so /products doesn't also highlight it)
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
      <div className="flex items-center gap-4">
        <span className="text-sm text-cream-soft/80 hidden sm:inline">
=======
      <div>
        <span className="font-serif text-lg">Lovely Kastha Udhog</span>
        <span className="text-cream-soft/50 text-sm ml-2">Admin</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-cream-soft/80">
>>>>>>> 4d4ae4a33e2b7a2a33076289f7660c0f9c2494e9
          Welcome, {adminName}
        </span>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-sm font-semibold border border-cream-soft/30 rounded-sm px-4 py-1.5 hover:bg-cream-soft/10 transition-colors duration-200 disabled:opacity-60"
        >
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </header>
  );
}
