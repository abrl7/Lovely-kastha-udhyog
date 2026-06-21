"use client";

import { useState } from "react";

// Matches the `category` enum on the Product model — kept here as the
// single source of truth for this form's dropdown options. If the
// Product model's category enum ever changes, update this list to match.
const CATEGORY_OPTIONS = [
  { value: "living_room", label: "Living Room Furniture" },
  { value: "bedroom", label: "Bedroom Furniture" },
  { value: "dining", label: "Dining Furniture" },
  { value: "office", label: "Office Furniture" },
  { value: "other", label: "Something Else / Not Sure" },
];

// Centralizing initial state in one object means resetting the form after
// a successful submit is a single line (`setFormData(initialFormState)`)
// instead of resetting each field individually.
const initialFormState = {
  name: "",
  phone: "",
  category: CATEGORY_OPTIONS[0].value,
  message: "",
};

export default function InquiryForm() {
  // formData holds what the user has typed — this is what makes the
  // inputs "controlled" (React owns the value, not the DOM). Controlled
  // inputs are what let us read formData.name etc. when submitting,
  // rather than reaching into the DOM manually.
  const [formData, setFormData] = useState(initialFormState);

  // submitStatus tracks where we are in the request lifecycle:
  // 'idle' -> 'submitting' -> 'success' | 'error'
  // Driving the UI off one status string (instead of separate
  // isLoading/isSuccess/isError booleans) avoids impossible states like
  // "loading AND success at the same time" that separate booleans allow.
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType: "custom",
          customerName: formData.name,
          customerPhone: formData.phone,
          customDetails: {
            // Folding the category into the description text (rather
            // than adding a separate top-level field) because the Order
            // model's customDetails.description is the one place this
            // kind of free-text context belongs — see models/Order.js.
            description: `[${
              CATEGORY_OPTIONS.find((c) => c.value === formData.category)
                ?.label
            }] ${formData.message}`,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // The API sends back a human-readable `error` string on failure
        // (see app/api/orders/route.js) — surfacing it directly means
        // validation problems are actually informative instead of a
        // generic "something went wrong."
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setSubmitStatus("success");
      setFormData(initialFormState);
    } catch (error) {
      console.error("Order submission failed:", error);
      setSubmitStatus("error");
      setErrorMessage(error.message);
    }
  }

  const fieldClass =
    "w-full px-[0.9rem] py-[0.8rem] border-[1.5px] border-walnut/20 bg-cream-soft rounded-sm font-sans text-[0.92rem] text-charcoal focus:outline-2 focus:outline-sienna focus:outline-offset-1 focus:border-sienna disabled:opacity-60 disabled:cursor-not-allowed";

  const labelClass =
    "block text-[0.78rem] font-semibold tracking-[0.04em] text-walnut-deep mb-[0.4rem]";

  const isSubmitting = submitStatus === "submitting";

  // Once the order is successfully created, show a confirmation instead
  // of the form. This also gives the customer their order code, which —
  // per the tracking design in app/api/orders/route.js — they'll need
  // alongside their phone number to check status later.
  if (submitStatus === "success") {
    return (
      <div className="py-[6.5rem] px-[5vw]">
        <div className="bg-cream-soft border-[1.5px] border-sienna/30 rounded-sm p-8">
          <h3 className="font-serif text-[1.4rem] text-walnut-deep mb-3">
            Inquiry received
          </h3>
          <p className="text-[0.95rem] text-charcoal/80 mb-4">
            Thanks — we&apos;ve got your request and will reach out soon.
            Keep your phone number handy if you&apos;d like to check on
            your order later.
          </p>
          <button
            type="button"
            onClick={() => setSubmitStatus("idle")}
            className="text-[0.85rem] font-semibold text-sienna hover:text-sienna-dark underline"
          >
            Submit another inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-[6.5rem] px-[5vw]">
      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-[1.1rem] mb-[1.1rem]">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              className={fieldClass}
            />
          </div>
        </div>
        <div className="mb-[1.1rem]">
          <label htmlFor="category" className={labelClass}>
            What are you interested in?
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
            className={fieldClass}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-[1.1rem]">
          <label htmlFor="message" className={labelClass}>
            Tell us more
          </label>
          <textarea
            id="message"
            required
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Describe the piece you're looking for, dimensions, wood preference, etc."
            className={`${fieldClass} min-h-[100px] resize-y`}
          />
        </div>

        {submitStatus === "error" && (
          <p className="text-[0.85rem] text-sienna-dark bg-sienna/10 border border-sienna/30 rounded-sm px-4 py-3 mb-[1.1rem]">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-sienna text-cream-soft border-none px-[2.3rem] py-[0.95rem] font-semibold text-[0.88rem] tracking-[0.04em] rounded-sm cursor-pointer hover:bg-sienna-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
}
