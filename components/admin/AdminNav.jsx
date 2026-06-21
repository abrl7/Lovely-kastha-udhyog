"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/apiRequest";

export default function AdminNav({ adminName }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      // Even if the logout request itself fails for some reason, we
      // still want to send the admin back to the login page rather than
      // leaving them stuck on a dashboard whose data may now be stale —
      // logging the error is enough; it doesn't need to block navigation.
      console.error("Logout request failed:", error);
    } finally {
      router.refresh();
      router.push("/admin/login");
    }
  }

  return (
    <header className="bg-walnut-deep text-cream-soft px-6 md:px-10 py-4 flex items-center justify-between">
      <div>
        <span className="font-serif text-lg">Lovely Kastha Udhog</span>
        <span className="text-cream-soft/50 text-sm ml-2">Admin</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-cream-soft/80">
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
