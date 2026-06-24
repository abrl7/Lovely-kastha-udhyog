"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "dining", label: "Dining" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

function ProductTile({ product }) {
  const firstImage = product.images?.[0]?.url;
  const price = product.priceMin
    ? `From Rs. ${product.priceMin.toLocaleString()}`
    : null;

  return (
    <div className="group bg-white border border-walnut/10 rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-56 bg-cream overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-charcoal/25 text-sm">No image yet</span>
          </div>
        )}
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-walnut-deep/50 flex items-center justify-center">
            <span className="bg-walnut-deep text-cream-soft text-xs font-semibold px-3 py-1.5 rounded-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif font-medium text-walnut-deep text-[1.05rem] leading-tight mb-1">
          {product.name}
        </h3>
        {product.woodType && (
          <p className="text-xs text-charcoal/50 mb-2">{product.woodType}</p>
        )}
        {product.description && (
          <p className="text-sm text-charcoal/70 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          {price && (
            <span className="text-sm font-semibold text-walnut">{price}</span>
          )}
          <Link
            href={`/custom?reference=${product._id}`}
            className="ml-auto text-xs font-semibold text-sienna hover:text-sienna-dark border border-sienna/30 hover:border-sienna px-3 py-1.5 rounded-sm transition-colors duration-150"
          >
            Inquire
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CatalogClient({ products }) {
  const [activeCategory, setActiveCategory] = useState("");

  const filtered =
    activeCategory === ""
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`text-sm font-medium px-4 py-1.5 rounded-sm border transition-colors duration-150 ${
              activeCategory === cat.value
                ? "bg-walnut text-cream-soft border-walnut"
                : "bg-white text-charcoal/70 border-walnut/20 hover:border-walnut/40"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Empty states */}
      {products.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-charcoal/50 mb-4">
            No ready-made pieces in the catalog yet.
          </p>
          <Link
            href="/custom"
            className="text-sienna font-semibold text-sm hover:text-sienna-dark underline"
          >
            Request a custom piece instead
          </Link>
        </div>
      )}

      {products.length > 0 && filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-charcoal/50">
            No items in this category right now.
          </p>
          <button
            onClick={() => setActiveCategory("")}
            className="text-sienna text-sm font-semibold hover:text-sienna-dark underline mt-2 block mx-auto"
          >
            Show all
          </button>
        </div>
      )}

      {/* Product grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductTile key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
