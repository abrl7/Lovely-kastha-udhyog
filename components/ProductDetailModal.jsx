"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductDetailModal({ product, onClose, onOrder, onReference }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  // images can be [{url, publicId}, ...] objects or plain strings
  const rawImages = product.images?.length ? product.images : [];
  const images = rawImages.length
    ? rawImages.map((img) => (typeof img === "string" ? img : img.url))
    : ["/placeholder-furniture.jpg"];

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function prev() { setImgIndex((i) => (i - 1 + images.length) % images.length); }
  function next() { setImgIndex((i) => (i + 1) % images.length); }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(46,32,23,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-t-sm sm:rounded-sm shadow-2xl w-full max-w-3xl max-h-[88vh] sm:max-h-[92vh] overflow-y-auto">
        {/* Close */}
        <div className="flex justify-end p-3 pb-0">
          <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal text-xl w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image carousel */}
          <div className="relative bg-cream-soft">
            <div
              className="aspect-square relative overflow-hidden bg-cream-soft cursor-zoom-in"
              onClick={() => setLightbox(true)}
              title="Click to enlarge"
            >
              {/* inset-4 gives padding so image never touches the edges;
                  object-contain shows the full image centered, no cropping */}
              <div className="absolute inset-4 sm:inset-6">
                <Image
                  src={images[imgIndex]}
                  alt={product.name}
                  fill
                  quality={92}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              {/* Enlarge hint */}
              <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[0.65rem] px-1.5 py-0.5 rounded-sm pointer-events-none select-none">
                ⤢ enlarge
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-walnut shadow-sm transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-walnut shadow-sm transition-all"
                  >
                    ›
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setImgIndex(idx); }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === imgIndex ? "bg-white w-3" : "bg-white/60"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip for 3+ images */}
            {images.length > 2 && (
              <div className="flex gap-1.5 p-2 overflow-x-auto">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImgIndex(idx)}
                    className={`relative flex-shrink-0 w-14 h-14 rounded-sm overflow-hidden border-2 transition-all ${
                      idx === imgIndex ? "border-sienna" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-4 md:p-6 flex flex-col">
            <div className="mb-1">
              <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase text-sienna">
                {(product.category || "Furniture").replace(/_/g, " ")}
              </p>
            </div>
            <h2 className="font-serif text-2xl text-walnut-deep mb-3 leading-snug">{product.name}</h2>

            {/* Price */}
            {(product.priceMin || product.priceMax) && (
              <div className="mb-4">
                {product.priceMin && product.priceMax && product.priceMin !== product.priceMax ? (
                  <p className="text-lg font-semibold text-walnut-deep">
                    Rs. {product.priceMin.toLocaleString()} – {product.priceMax.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-walnut-deep">
                    Rs. {(product.priceMin || product.priceMax).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm text-charcoal/70 leading-relaxed mb-5 flex-1">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-cream text-charcoal/60 px-2 py-0.5 rounded-sm border border-walnut/10">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stock badge */}
            {product.listingType === "ready_made" && (
              <p className={`text-xs font-semibold mb-4 ${product.stockQuantity > 0 ? "text-green-700" : "text-red-600"}`}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5 mt-auto">
              {product.listingType === "ready_made" && product.stockQuantity > 0 && onOrder && (
                <button
                  onClick={() => { onClose(); onOrder(product); }}
                  className="w-full bg-sienna text-cream-soft font-semibold text-sm py-2.5 rounded-sm hover:bg-sienna-dark transition-colors"
                >
                  Order Now
                </button>
              )}
              {onReference && (
                <button
                  onClick={() => { onClose(); onReference(product); }}
                  className="w-full border border-walnut/30 text-walnut-deep font-semibold text-sm py-2.5 rounded-sm hover:bg-cream transition-colors"
                >
                  Use as Reference for Custom Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox — outer modal is z-[110] (above nav z-[100]), so this z-[500] within that context wins everything */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[500] flex flex-col items-center justify-center p-8 sm:p-14 pt-14 sm:pt-16"
          style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
          onClick={() => setLightbox(false)}
        >
          {/* Close button — always visible above the image */}
          <button
            className="absolute top-5 right-5 bg-white/15 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg transition-colors"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Image fills the padded area */}
          <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[imgIndex]}
              alt={product.name}
              fill
              quality={95}
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-xl transition-colors"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-xl transition-colors"
              >
                ›
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/50 text-xs">
                {imgIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
