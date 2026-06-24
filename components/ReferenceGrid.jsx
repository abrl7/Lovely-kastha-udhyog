"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const CATEGORY_LABELS = {
  living_room: "Living Room",
  bedroom: "Bedroom",
  dining: "Dining",
  office: "Office",
  custom: "Custom",
  other: "Other",
};

export default function ReferenceGrid({ products, highlightedId }) {
  const highlightedRef = useRef(null);

  // Auto-scroll the highlighted tile into view after the page loads.
  // Without this, the highlighted tile could be far down the grid and
  // the customer would have no idea it's there.
  useEffect(() => {
    if (highlightedRef.current) {
      // Small delay so the page has finished layout before scrolling,
      // otherwise the scroll position may be calculated incorrectly.
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [highlightedId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        // _id is now always a plain string (serialized in lib/data.js),
        // so direct equality comparison works correctly here.
        const isHighlighted = product._id === highlightedId;
        const firstImage = product.images?.[0]?.url;

        return (
          <div
            key={product._id}
            ref={isHighlighted ? highlightedRef : null}
            className={`group rounded-sm overflow-hidden border transition-all duration-200 ${
              isHighlighted
                ? "border-sienna shadow-lg ring-2 ring-sienna/20"
                : "border-walnut/10 hover:shadow-sm"
            }`}
          >
            <div className="relative h-52 bg-cream overflow-hidden">
              {firstImage ? (
                <Image
                  src={firstImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-charcoal/25 text-sm">No image</span>
                </div>
              )}
              {isHighlighted && (
                <div className="absolute top-3 left-3 bg-sienna text-cream-soft text-[0.68rem] font-semibold px-2 py-1 rounded-sm">
                  ✓ Selected reference
                </div>
              )}
            </div>
            <div className={`p-4 ${isHighlighted ? "bg-sienna/5" : "bg-white"}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif font-medium text-walnut-deep text-[1rem] leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-charcoal/50 mt-0.5">
                    {CATEGORY_LABELS[product.category] || product.category}
                    {product.woodType ? ` · ${product.woodType}` : ""}
                    {product.listingType === "ready_made" ? " · Ready-made" : ""}
                  </p>
                </div>
                {product.priceMin && (
                  <span className="text-xs text-charcoal/50 whitespace-nowrap flex-none">
                    From Rs. {product.priceMin.toLocaleString()}
                  </span>
                )}
              </div>
              {product.description && (
                <p className="text-sm text-charcoal/60 mt-2 line-clamp-2">
                  {product.description}
                </p>
              )}
              <Link
                href="#inquiry"
                className={`block mt-3 text-center text-xs font-semibold px-3 py-1.5 rounded-sm transition-colors duration-150 ${
                  isHighlighted
                    ? "bg-sienna text-cream-soft hover:bg-sienna-dark"
                    : "text-sienna hover:text-sienna-dark border border-sienna/30 hover:border-sienna"
                }`}
              >
                {isHighlighted ? "Fill in the form below ↓" : "Use as reference"}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
