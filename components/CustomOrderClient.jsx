"use client";

import { useState } from "react";
import ReferenceGrid from "./ReferenceGrid";
import InquiryForm from "./InquiryForm";

// Holds the selectedReference state that needs to be shared between
// ReferenceGrid (writes it) and InquiryForm (reads it). Both are client
// components so they must live under a common client parent — this is it.
// initialReference: product object pre-populated from URL ?reference=<id>
export default function CustomOrderClient({ products, initialReference = null }) {
  const [selectedReference, setSelectedReference] = useState(initialReference);

  return (
    <>
      {products.length > 0 && (
        <div className="px-[6vw] mb-16">
          <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-charcoal/40 mb-5">
            {selectedReference
              ? `Referencing: ${selectedReference.name} — shown in the form below`
              : "Browse for inspiration — or describe your own idea below"}
          </p>
          <ReferenceGrid
            products={products}
            selectedId={selectedReference?._id || null}
            onSelect={setSelectedReference}
          />
        </div>
      )}

      <section id="inquiry" className="bg-cream grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-walnut text-cream-soft py-[6.5rem] px-[5vw]">
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass">
            Get In Touch
          </span>
          <h2 className="font-serif font-normal text-[2.2rem] mt-[0.7rem] mb-[1.3rem]">
            Tell us what you&apos;re building.
          </h2>
          <p className="text-cream-soft/80 mb-8 max-w-[380px]">
            Looking for a piece from our collection, or something custom-made
            to fit your space? Send us a few details and we&apos;ll get back
            to you within a day.
          </p>
          <div className="mb-[1.1rem]">
            <span className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass mb-[0.2rem]">
              Workshop
            </span>
            <span className="text-[0.98rem]">
              [Your dad&apos;s workshop address here]
            </span>
          </div>
          <div className="mb-[1.1rem]">
            <span className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass mb-[0.2rem]">
              Phone
            </span>
            <a
              href="tel:+977XXXXXXXXXX"
              className="text-[0.98rem] hover:text-brass transition-colors"
            >
              +977-XX-XXXXXXX
            </a>
          </div>
          <div className="mb-[1.1rem]">
            <span className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass mb-[0.2rem]">
              Hours
            </span>
            <span className="text-[0.98rem]">Sun–Fri, 10am – 7pm</span>
          </div>
        </div>
        <InquiryForm
          selectedReference={selectedReference}
          onClearReference={() => setSelectedReference(null)}
        />
      </section>
    </>
  );
}
