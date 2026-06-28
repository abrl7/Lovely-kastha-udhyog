"use client";

import Image from "next/image";

const CATEGORY_LABELS = {
  living_room: "Living Room",
  bedroom: "Bedroom",
  dining: "Dining",
  office: "Office",
  custom: "Custom",
  other: "Other",
};

// onSelect(product) — called when customer clicks "Use as reference"
// selectedId — the _id of the currently selected product (or null)
export default function ReferenceGrid({ products, selectedId, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const isSelected = product._id === selectedId;
        const firstImage = product.images?.[0]?.url;

        return (
          <div
            key={product._id}
            className={`group rounded-sm overflow-hidden border transition-all duration-200 ${
              isSelected
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
              {isSelected && (
                <div className="absolute top-3 left-3 bg-sienna text-cream-soft text-[0.68rem] font-semibold px-2 py-1 rounded-sm">
                  ✓ Selected reference
                </div>
              )}
            </div>
            <div className={`p-4 ${isSelected ? "bg-sienna/5" : "bg-white"}`}>
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
              <button
                type="button"
                onClick={() => {
                  onSelect(isSelected ? null : product);
                  document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`block w-full mt-3 text-center text-xs font-semibold px-3 py-1.5 rounded-sm transition-colors duration-150 ${
                  isSelected
                    ? "bg-sienna text-cream-soft hover:bg-sienna-dark"
                    : "text-sienna hover:text-sienna-dark border border-sienna/30 hover:border-sienna"
                }`}
              >
                {isSelected ? "Selected — fill form below ↓" : "Use as reference"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
