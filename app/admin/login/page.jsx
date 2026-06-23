"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/apiRequest";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // A full navigation (not client-side router.push alone) ensures the
      // dashboard's server-side layout re-checks the session cookie that
      // was just set, rather than potentially rendering from stale
      // client-side state. router.refresh() forces Next.js to re-run
      // server components on the next navigation.
      router.refresh();
      router.push("/admin/dashboard");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <main className="min-h-screen bg-cream-soft flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-walnut-deep">
            Lovely Kastha Udhog
          </h1>
          <p className="text-sm text-charcoal/60 mt-1">Admin Sign In</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-walnut/15 rounded-sm p-8"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-[0.78rem] font-semibold tracking-[0.04em] text-walnut-deep mb-[0.4rem]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-[0.9rem] py-[0.8rem] border-[1.5px] border-walnut/20 bg-cream-soft rounded-sm text-[0.92rem] text-charcoal focus:outline-2 focus:outline-sienna focus:outline-offset-1 focus:border-sienna disabled:opacity-60"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-[0.78rem] font-semibold tracking-[0.04em] text-walnut-deep mb-[0.4rem]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-[0.9rem] py-[0.8rem] border-[1.5px] border-walnut/20 bg-cream-soft rounded-sm text-[0.92rem] text-charcoal focus:outline-2 focus:outline-sienna focus:outline-offset-1 focus:border-sienna disabled:opacity-60"
            />
          </div>

          {status === "error" && (
            <p className="text-[0.85rem] text-sienna-dark bg-sienna/10 border border-sienna/30 rounded-sm px-4 py-3 mb-4">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sienna text-cream-soft font-semibold text-[0.88rem] tracking-[0.04em] py-[0.9rem] rounded-sm hover:bg-sienna-dark transition-colors duration-200 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[0.85rem] text-charcoal/60 mt-5">
          First time setting up?{" "}
          <Link
            href="/admin/signup"
            className="text-sienna font-medium hover:text-sienna-dark"
          >
            Create admin account
          </Link>
        </p>
      </div>
    </main>
  );
}
