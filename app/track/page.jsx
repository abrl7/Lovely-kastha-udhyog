"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderTimeline from "@/components/OrderTimeline";

// Human-readable labels and descriptions for each status stage.
// The description is what the customer sees — written from their
// perspective, not internal workshop language.
export const STATUS_INFO = {
  new: {
    label: "Inquiry Received",
    description: "We've received your request and will be in touch shortly to discuss the details.",
    color: "bg-blue-500",
  },
  confirmed: {
    label: "Order Confirmed",
    description: "Your order has been confirmed. We've agreed on the details and will begin work soon.",
    color: "bg-indigo-500",
  },
  measurement_scheduled: {
    label: "Measurement Visit Scheduled",
    description: "We've scheduled a visit to take measurements. We'll confirm the time with you.",
    color: "bg-yellow-500",
  },
  measurement_done: {
    label: "Measurements Taken",
    description: "Measurements are complete. We're finalising the design before starting production.",
    color: "bg-orange-500",
  },
  in_production: {
    label: "In Production",
    description: "Your piece is being crafted in our workshop. We'll let you know when it's ready.",
    color: "bg-amber-500",
  },
  ready: {
    label: "Ready for Delivery",
    description: "Your furniture is ready! We'll contact you to arrange delivery or pickup.",
    color: "bg-green-500",
  },
  delivered: {
    label: "Delivered",
    description: "Your order has been delivered. Thank you for choosing Lovely Kastha Udhog.",
    color: "bg-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    description: "This order has been cancelled. Please contact us if you have any questions.",
    color: "bg-red-500",
  },
};

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | found | not_found | error
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setStatus("loading");
    setOrder(null);
    setErrorMessage("");

    try {
      const res = await fetch(
        `/api/orders?phone=${encodeURIComponent(phone.trim())}&orderCode=${encodeURIComponent(orderCode.trim().toUpperCase())}`
      );
      const result = await res.json();

      if (res.status === 404) {
        setStatus("not_found");
        return;
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      setOrder(result.data);
      setStatus("found");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  const inputClass =
    "w-full px-[0.9rem] py-[0.85rem] border-[1.5px] border-walnut/20 bg-white rounded-sm text-[0.95rem] text-charcoal focus:outline-2 focus:outline-sienna focus:border-sienna";
  const labelClass =
    "block text-[0.78rem] font-semibold tracking-[0.06em] uppercase text-walnut-deep mb-[0.4rem]";

  return (
    <main>
      <Header />
      <div className="min-h-screen pt-32 pb-20 px-[6vw] bg-cream-soft">
        <div className="max-w-[560px] mx-auto">
          {/* Page heading */}
          <div className="mb-10">
            <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-sienna">
              Order Tracking
            </span>
            <h1 className="font-serif font-medium text-[clamp(1.9rem,3.5vw,2.6rem)] text-walnut-deep mt-2">
              Track your order
            </h1>
            <p className="text-charcoal/65 mt-2 text-[0.95rem]">
              Enter the phone number you used when placing your order, along
              with your order code (e.g. LKU-2026-0001).
            </p>
          </div>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="bg-white border border-walnut/15 rounded-sm p-6 mb-8"
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9800000000"
                  disabled={status === "loading"}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="orderCode" className={labelClass}>
                  Order Code
                </label>
                <input
                  id="orderCode"
                  type="text"
                  required
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  placeholder="e.g. LKU-2026-0001"
                  disabled={status === "loading"}
                  className={`${inputClass} uppercase placeholder:normal-case`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-sienna text-cream-soft font-semibold text-[0.9rem] py-[0.9rem] rounded-sm hover:bg-sienna-dark transition-colors duration-200 disabled:opacity-60"
            >
              {status === "loading" ? "Searching…" : "Track Order"}
            </button>
          </form>

          {/* Not found */}
          {status === "not_found" && (
            <div className="bg-white border border-walnut/15 rounded-sm p-6 text-center">
              <p className="font-serif text-lg text-walnut-deep mb-2">
                No order found
              </p>
              <p className="text-sm text-charcoal/60">
                We couldn&apos;t find an order matching that phone number and
                order code. Please double-check both and try again, or contact
                us directly.
              </p>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="bg-sienna/8 border border-sienna/25 rounded-sm p-4">
              <p className="text-sm text-sienna-dark">{errorMessage}</p>
            </div>
          )}

          {/* Order found */}
          {status === "found" && order && (
            <OrderResult order={order} />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

// Separated into its own component for clarity — renders when an order
// is successfully found.
function OrderResult({ order }) {
  const info = STATUS_INFO[order.status] || {
    label: order.status,
    description: "",
    color: "bg-gray-400",
  };

  const isCustom = order.orderType === "custom";
  const createdDate = new Date(order.createdAt).toLocaleDateString("en-NP", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Status card */}
      <div className="bg-white border border-walnut/15 rounded-sm overflow-hidden">
        <div className={`${info.color} px-6 py-4`}>
          <p className="text-white/80 text-xs font-semibold tracking-wide uppercase mb-0.5">
            Current Status
          </p>
          <p className="text-white font-serif text-xl font-medium">
            {info.label}
          </p>
        </div>
        <div className="px-6 py-4">
          <p className="text-charcoal/70 text-sm">{info.description}</p>
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white border border-walnut/15 rounded-sm p-6">
        <h2 className="font-serif text-walnut-deep text-lg mb-4">
          Order Summary
        </h2>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.06em] uppercase text-charcoal/40 mb-0.5">
              Order Code
            </p>
            <p className="font-medium text-walnut-deep">{order.orderCode}</p>
          </div>
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.06em] uppercase text-charcoal/40 mb-0.5">
              Date Placed
            </p>
            <p>{createdDate}</p>
          </div>
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.06em] uppercase text-charcoal/40 mb-0.5">
              Order Type
            </p>
            <p>{isCustom ? "Custom Order" : "Ready-made"}</p>
          </div>
          {order.agreedPrice && (
            <div>
              <p className="text-[0.72rem] font-semibold tracking-[0.06em] uppercase text-charcoal/40 mb-0.5">
                Agreed Price
              </p>
              <p>Rs. {order.agreedPrice.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* What they ordered */}
        <div className="mt-4 pt-4 border-t border-walnut/10">
          <p className="text-[0.72rem] font-semibold tracking-[0.06em] uppercase text-charcoal/40 mb-1.5">
            {isCustom ? "Your Request" : "Item"}
          </p>
          {isCustom ? (
            <p className="text-sm text-charcoal/80">
              {order.customDetails?.description}
            </p>
          ) : (
            <p className="text-sm text-charcoal/80">
              {order.product?.name || "Ready-made item"} · Qty:{" "}
              {order.quantity}
            </p>
          )}
        </div>
      </div>

      {/* Timeline */}
      {order.statusHistory?.length > 0 && (
        <div className="bg-white border border-walnut/15 rounded-sm p-6">
          <h2 className="font-serif text-walnut-deep text-lg mb-5">
            Order Timeline
          </h2>
          <OrderTimeline history={order.statusHistory} />
        </div>
      )}

      {/* Contact nudge */}
      <div className="bg-cream border border-walnut/10 rounded-sm px-6 py-4 text-center">
        <p className="text-sm text-charcoal/60">
          Questions about your order?{" "}
          <a
            href="/#inquiry"
            className="text-sienna font-semibold hover:text-sienna-dark"
          >
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
