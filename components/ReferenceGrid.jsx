"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

const CATEGORY_LABELS = {
  living_room: "Living Room",
  bedroom: "Bedroom",
  dining: "Dining",
  office: "Office",
  custom: "Custom",
  other: "Other",
};

function ReferenceCard({ product, isSelected, onSelect }) {
  const images = product.images || [];
  const [imgIndex, setImgIndex] = useState(0);

  const prev = useCallback((e) => {
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback((e) => {
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const currentImage = images[imgIndex]?.url;

  return (
    <div
      className={`group rounded-sm overflow-hidden border transition-all duration-200 ${
        isSelected
          ? "border-sienna shadow-lg ring-2 ring-sienna/20"
          : "border-walnut/10 hover:shadow-sm"
      }`}
    >
      {/* Image area with carousel */}
      <div className="relative h-52 bg-cream overflow-hidden">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={`${product.name} — image ${imgIndex + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-charcoal/25 text-sm">No image</span>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-black/50"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-black/50"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? "bg-white scale-125" : "bg-white/50"}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {isSelected && (
          <div className="absolute top-3 left-3 bg-sienna text-cream-soft text-[0.68rem] font-semibold px-2 py-1 rounded-sm">
            ✓ Selected reference
          </div>
        )}
      </div>

      {/* Card body */}
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
}

// onSelect(product) — called when customer clicks "Use as reference"
// selectedId — the _id of the currently selected product (or null)
export default function ReferenceGrid({ products, selectedId, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ReferenceCard
          key={product._id}
          product={product}
          isSelected={product._id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
