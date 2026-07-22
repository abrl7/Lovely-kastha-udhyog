"use client";

import { useState, useEffect } from "react";

function OrderCodeBox({ orderCode }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(orderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }
  return (
    <div className="bg-cream border border-walnut/15 rounded-sm p-4 mb-5">
      <p className="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-charcoal/40 mb-2">
        Your Order Code
      </p>
      <div className="flex items-center gap-3">
        <p className="font-serif text-2xl text-walnut-deep font-medium tracking-wide flex-1">
          {orderCode}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className={`text-xs font-semibold px-3 py-1.5 rounded-sm border transition-all duration-150 ${
            copied ? "bg-green-50 border-green-300 text-green-700" : "border-walnut/25 text-charcoal/60 hover:border-walnut/50"
          }`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <p className="text-xs text-charcoal/50 mt-2">
        Save this — you&apos;ll need it with your phone number to track your order.
      </p>
    </div>
  );
}

export default function ReadyMadeOrderModal({ product, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", quantity: "1" });
  const [status, setStatus]   = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [orderCode, setOrderCode] = useState(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType:     "ready_made",
          customerName:  form.name,
          customerPhone: form.phone,
          customerEmail: form.email || undefined,
          product:       product._id,
          quantity:      parseInt(form.quantity, 10) || 1,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || "Something went wrong.");
      setOrderCode(result.data.orderCode);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  const maxQty  = product.stockQuantity || 1;
  const isBusy  = status === "submitting";

  const fieldClass = "w-full px-3 py-2.5 border-[1.5px] border-walnut/20 bg-cream-soft rounded-sm text-sm text-charcoal focus:outline-2 focus:outline-sienna disabled:opacity-60";
  const labelClass = "block text-[0.75rem] font-semibold tracking-[0.04em] text-walnut-deep mb-1";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(46,32,23,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-walnut/10">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase text-sienna mb-1">
              Place Order
            </p>
            <h2 className="font-serif text-xl text-walnut-deep leading-tight">
              {product.name}
            </h2>
            {product.priceMin && (
              <p className="text-sm text-charcoal/60 mt-0.5">
                From Rs. {product.priceMin.toLocaleString()}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal text-xl leading-none ml-4 mt-1">✕</button>
        </div>

        <div className="p-6">
          {status === "success" ? (
            <>
              <p className="text-[0.95rem] text-charcoal/80 mb-5">
                Your order has been placed! We&apos;ll call you to confirm delivery.
              </p>
              <OrderCodeBox orderCode={orderCode} />
              <div className="flex gap-3">
                <a
                  href="/track"
                  className="flex-1 text-center bg-sienna text-cream-soft font-semibold text-sm py-2.5 rounded-sm hover:bg-sienna-dark transition-colors"
                >
                  Track order →
                </a>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-semibold border border-walnut/25 text-charcoal/70 rounded-sm hover:bg-cream transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label htmlFor="name" className={labelClass}>Full Name *</label>
                  <input id="name" type="text" required value={form.name} onChange={handleChange} disabled={isBusy} className={fieldClass} />
                </div>
                <div className="col-span-2">
                  <label htmlFor="phone" className={labelClass}>Phone Number *</label>
                  <input id="phone" type="tel" required value={form.phone} onChange={handleChange} disabled={isBusy} className={fieldClass} />
                </div>
                <div className="col-span-2">
                  <label htmlFor="email" className={labelClass}>
                    Email{" "}
                    <span className="text-charcoal/40 font-normal normal-case tracking-normal">(optional — for status updates)</span>
                  </label>
                  <input id="email" type="email" value={form.email} onChange={handleChange} disabled={isBusy} className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="quantity" className={labelClass}>Quantity</label>
                  <select id="quantity" value={form.quantity} onChange={handleChange} disabled={isBusy} className={fieldClass}>
                    {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <p className="text-xs text-charcoal/50 mb-2.5">
                    {maxQty} in stock
                  </p>
                </div>
              </div>

              {status === "error" && (
                <p className="text-sm text-sienna-dark bg-sienna/10 border border-sienna/30 rounded-sm px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="flex-1 bg-sienna text-cream-soft font-semibold text-sm py-2.5 rounded-sm hover:bg-sienna-dark transition-colors disabled:opacity-60"
                >
                  {isBusy ? "Placing order…" : "Place Order"}
                </button>
                <button type="button" onClick={onClose} disabled={isBusy} className="px-4 py-2.5 text-sm font-semibold border border-walnut/25 text-charcoal/70 rounded-sm hover:bg-cream transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
