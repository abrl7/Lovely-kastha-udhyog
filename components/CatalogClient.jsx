"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const ProductDetailModal  = dynamic(() => import("./ProductDetailModal"),  { ssr: false });
const ReadyMadeOrderModal = dynamic(() => import("./ReadyMadeOrderModal"), { ssr: false });

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "dining", label: "Dining" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

const PRICE_RANGES = [
  { value: "", label: "Any price" },
  { value: "0-10000", label: "Under Rs. 10,000" },
  { value: "10000-30000", label: "Rs. 10,000 – 30,000" },
  { value: "30000-60000", label: "Rs. 30,000 – 60,000" },
  { value: "60000-999999999", label: "Rs. 60,000+" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A – Z" },
];

function ProductTile({ product, onView, onOrder }) {
  const images = product.images || [];
  const [imgIndex, setImgIndex] = useState(0);
  const price = product.priceMin
    ? `From Rs. ${product.priceMin.toLocaleString()}`
    : null;

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
      className="group bg-white border border-walnut/10 rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={() => onView(product)}
    >
      <div className="relative h-56 bg-cream overflow-hidden">
        {currentImage ? (
          <>
            {/* Blurred background — same image stretched + blurred to fill empty letterbox areas */}
            <Image
              src={currentImage}
              alt=""
              fill
              quality={10}
              sizes="300px"
              aria-hidden="true"
              className="object-cover scale-110 blur-2xl opacity-60"
            />
            {/* Main image — object-contain so the full photo is always visible */}
            <Image
              src={currentImage}
              alt={`${product.name} — image ${imgIndex + 1}`}
              fill
              quality={90}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-charcoal/25 text-sm">No image yet</span>
          </div>
        )}

        {/* Carousel nav — only shown when product has multiple images */}
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
            {/* Dot indicators */}
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
        <div className="flex items-center gap-2 justify-between">
          {price && (
            <span className="text-sm font-semibold text-walnut">{price}</span>
          )}
          <div className="flex gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
            {product.listingType === "ready_made" && product.stockQuantity > 0 && (
              <button
                onClick={() => onOrder(product)}
                className="text-xs font-semibold text-cream-soft bg-sienna hover:bg-sienna-dark px-3 py-1.5 rounded-sm transition-colors duration-150"
              >
                Order
              </button>
            )}
            <button
              onClick={() => onView(product)}
              className="text-xs font-semibold text-sienna hover:text-sienna-dark border border-sienna/30 hover:border-sienna px-3 py-1.5 rounded-sm transition-colors duration-150"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogClient({ products }) {
  const [activeCategory, setActiveCategory]           = useState("");
  const [priceRange, setPriceRange]                   = useState("");
  const [sort, setSort]                               = useState("default");
  const [detailProduct, setDetailProduct]             = useState(null);
  const [orderProduct, setOrderProduct]               = useState(null);

  const filtered = useMemo(() => {
    let result = [...products];

    // Category
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Price range
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((p) => {
        if (!p.priceMin) return false;
        return p.priceMin >= min && p.priceMin <= max;
      });
    }

    // Sort
    if (sort === "price_asc") {
      result.sort((a, b) => (a.priceMin ?? Infinity) - (b.priceMin ?? Infinity));
    } else if (sort === "price_desc") {
      result.sort((a, b) => (b.priceMin ?? -1) - (a.priceMin ?? -1));
    } else if (sort === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, activeCategory, priceRange, sort]);

  const hasActiveFilters = activeCategory || priceRange || sort !== "default";

  function clearAll() {
    setActiveCategory("");
    setPriceRange("");
    setSort("default");
  }

  const selectClass =
    "text-sm text-charcoal/80 border border-walnut/20 bg-white rounded-sm px-3 py-1.5 focus:outline-1 focus:outline-sienna cursor-pointer";

  return (
    <>
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
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

        {/* Divider */}
        <span className="hidden sm:block w-px h-5 bg-walnut/15 mx-1" />

        {/* Price range */}
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className={selectClass}
          aria-label="Filter by price"
        >
          {PRICE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={selectClass}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-sienna hover:text-sienna-dark underline ml-1"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results count when filters are active */}
      {hasActiveFilters && products.length > 0 && (
        <p className="text-xs text-charcoal/45 mb-4">
          {filtered.length} {filtered.length === 1 ? "item" : "items"} found
        </p>
      )}

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
          <p className="text-charcoal/50 mb-2">No items match these filters.</p>
          <button
            onClick={clearAll}
            className="text-sienna text-sm font-semibold hover:text-sienna-dark underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Product grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductTile
              key={product._id}
              product={product}
              onView={setDetailProduct}
              onOrder={setOrderProduct}
            />
          ))}
        </div>
      )}

      {/* Product detail modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onOrder={(p) => { setDetailProduct(null); setOrderProduct(p); }}
          onReference={(p) => {
            setDetailProduct(null);
            window.location.href = `/custom?reference=${p._id}`;
          }}
        />
      )}

      {/* Ready-made order modal */}
      {orderProduct && (
        <ReadyMadeOrderModal
          product={orderProduct}
          onClose={() => setOrderProduct(null)}
        />
      )}
    </>
  );
}
