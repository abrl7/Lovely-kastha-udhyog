"use client";

import { useState } from "react";
import { useEffect } from "react";

const FURNITURE_TYPES = [
  { value: "table",    label: "Table / Desk" },
  { value: "wardrobe", label: "Wardrobe / Cabinet" },
  { value: "sofa",     label: "Sofa / Couch" },
  { value: "bed",      label: "Bed / Headboard" },
  { value: "chair",    label: "Chair / Stool" },
  { value: "shelf",    label: "Shelf / Rack / Bookcase" },
  { value: "other",    label: "Other / Not Sure" },
];

const CONTACT_PHONE = "+977-98-16630510"; // replace with real number
const CONTACT_WHATSAPP = "9779816630510"; // replace with real number (digits only)

const initialFormState = {
  name:          "",
  phone:         "",
  furnitureType: "",
  dimensions:    "",
  woodPreference:"",
  message:       "",
};

// selectedReference — product object passed from CustomOrderClient (or null)
// onClearReference  — callback to deselect the reference tile
export default function InquiryForm({ selectedReference, onClearReference }) {
  const [formData, setFormData]       = useState(initialFormState);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

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
          orderType:    "custom",
          customerName:  formData.name,
          customerPhone: formData.phone,
          customDetails: {
            referenceProduct: selectedReference?._id || null,
            furnitureType:    formData.furnitureType || "other",
            description:      formData.message,
            dimensions:       formData.dimensions,
            woodPreference:   formData.woodPreference,
          },
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setSubmitStatus("success");
      setConfirmedOrder({ orderCode: result.data.orderCode });
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

  if (submitStatus === "success") {
    const waText = encodeURIComponent(
      `Hi, I just submitted an inquiry. My order code is ${confirmedOrder?.orderCode}.`
    );

    return (
      <div className="py-[6.5rem] px-[5vw]">
        <div className="bg-cream-soft border-[1.5px] border-sienna/30 rounded-sm p-8">
          <h3 className="font-serif text-[1.4rem] text-walnut-deep mb-2">
            Inquiry received
          </h3>
          <p className="text-[0.95rem] text-charcoal/80 mb-5">
            Thanks — we&apos;ve got your request and will be in touch soon.
          </p>

          {confirmedOrder && (
            <div className="bg-white border border-walnut/15 rounded-sm p-4 mb-6">
              <p className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-charcoal/40 mb-1">
                Your Order Code
              </p>
              <p className="font-serif text-2xl text-walnut-deep font-medium tracking-wide">
                {confirmedOrder.orderCode}
              </p>
              <p className="text-xs text-charcoal/50 mt-1">
                Save this — you&apos;ll need it with your phone number to track your order.
              </p>
            </div>
          )}

          {/* Next steps + contact */}
          <div className="border-t border-walnut/10 pt-5 mb-6">
            <p className="text-[0.78rem] font-semibold tracking-[0.08em] uppercase text-charcoal/40 mb-3">
              What happens next
            </p>
            <p className="text-[0.9rem] text-charcoal/70 mb-4">
              We&apos;ll call you within 24 hours to discuss the details and schedule a
              measurement visit if needed.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-2 bg-walnut text-cream-soft text-[0.85rem] font-semibold px-4 py-2.5 rounded-sm hover:bg-walnut-deep transition-colors duration-200"
              >
                <span>📞</span> Call us
              </a>
              <a
                href={`https://wa.me/${CONTACT_WHATSAPP}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white text-[0.85rem] font-semibold px-4 py-2.5 rounded-sm hover:bg-[#1ebe5a] transition-colors duration-200"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>
            <p className="text-xs text-charcoal/40 mt-3">
              {CONTACT_PHONE} · Sun–Fri, 10am–7pm
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/track"
              className="inline-block bg-sienna text-cream-soft font-semibold text-[0.88rem] px-5 py-2.5 rounded-sm hover:bg-sienna-dark transition-colors duration-200"
            >
              Track your order →
            </a>
            <button
              type="button"
              onClick={() => { setSubmitStatus("idle"); setConfirmedOrder(null); }}
              className="text-[0.85rem] font-semibold text-sienna hover:text-sienna-dark underline"
            >
              Submit another inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-[6.5rem] px-[5vw]">
      {/* Reference chip — shown when customer selected a product above */}
      {selectedReference && (
        <div className="flex items-center gap-2 bg-sienna/8 border border-sienna/25 rounded-sm px-3 py-2 mb-5">
          <span className="text-[0.78rem] text-charcoal/60 font-medium">Referencing:</span>
          <span className="text-[0.85rem] font-semibold text-walnut-deep flex-1">
            {selectedReference.name}
          </span>
          <button
            type="button"
            onClick={onClearReference}
            className="text-charcoal/35 hover:text-charcoal text-sm leading-none ml-1"
            aria-label="Remove reference"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name + Phone */}
        <div className="grid sm:grid-cols-2 gap-[1.1rem] mb-[1.1rem]">
          <div>
            <label htmlFor="name" className={labelClass}>Full Name</label>
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
            <label htmlFor="phone" className={labelClass}>Phone Number</label>
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

        {/* Furniture type */}
        <div className="mb-[1.1rem]">
          <label htmlFor="furnitureType" className={labelClass}>
            Type of furniture{" "}
            <span className="text-charcoal/40 font-normal normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <select
            id="furnitureType"
            value={formData.furnitureType}
            onChange={handleChange}
            disabled={isSubmitting}
            className={fieldClass}
          >
            <option value="">— Select a type —</option>
            {FURNITURE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Rough size hint */}
        <div className="mb-[1.1rem]">
          <label htmlFor="dimensions" className={labelClass}>
            Approximate size{" "}
            <span className="text-charcoal/40 font-normal normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <input
            type="text"
            id="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder='e.g. "5 feet wide", "fits a 3m × 4m room", "same as queen bed"'
            className={fieldClass}
          />
          <p className="text-[0.74rem] text-charcoal/45 mt-1.5">
            Rough estimates are fine — exact measurements will be confirmed during
            a visit or call.
          </p>
        </div>

        {/* Wood preference */}
        <div className="mb-[1.1rem]">
          <label htmlFor="woodPreference" className={labelClass}>
            Wood preference{" "}
            <span className="text-charcoal/40 font-normal normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <input
            type="text"
            id="woodPreference"
            value={formData.woodPreference}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder='e.g. "Teak", "Sal", "dark finish", "natural"'
            className={fieldClass}
          />
        </div>

        {/* Description */}
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
            placeholder="Describe the piece you're looking for — style, usage, any special requirements…"
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
          {isSubmitting ? "Sending…" : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
}
