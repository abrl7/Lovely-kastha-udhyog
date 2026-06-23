"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/apiRequest";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  signupSecret: "",
};

export default function AdminSignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      router.refresh();
      router.push("/admin/dashboard");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  }

  const isSubmitting = status === "submitting";
  const fieldClass =
    "w-full px-[0.9rem] py-[0.8rem] border-[1.5px] border-walnut/20 bg-cream-soft rounded-sm text-[0.92rem] text-charcoal focus:outline-2 focus:outline-sienna focus:outline-offset-1 focus:border-sienna disabled:opacity-60";
  const labelClass =
    "block text-[0.78rem] font-semibold tracking-[0.04em] text-walnut-deep mb-[0.4rem]";

  return (
    <main className="min-h-screen bg-cream-soft flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-walnut-deep">
            Lovely Kastha Udhog
          </h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Create Admin Account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-walnut/15 rounded-sm p-8"
        >
          <div className="mb-4">
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={fieldClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={fieldClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className={fieldClass}
            />
            <p className="text-[0.75rem] text-charcoal/50 mt-1">
              At least 8 characters.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="signupSecret" className={labelClass}>
              Signup Secret
            </label>
            <input
              id="signupSecret"
              type="password"
              required
              value={formData.signupSecret}
              onChange={handleChange}
              disabled={isSubmitting}
              className={fieldClass}
            />
            <p className="text-[0.75rem] text-charcoal/50 mt-1">
              The shared code only you and your dad know.
            </p>
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
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-[0.85rem] text-charcoal/60 mt-5">
          Already have an account?{" "}
          <Link
            href="/admin/login"
            className="text-sienna font-medium hover:text-sienna-dark"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
