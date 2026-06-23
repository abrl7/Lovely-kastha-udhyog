"use client";

import { useState, useEffect } from "react";

const CATEGORIES = [
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "dining", label: "Dining" },
  { value: "office", label: "Office" },
  { value: "custom", label: "Custom" },
  { value: "other", label: "Other" },
];

const emptyForm = {
  name: "",
  listingType: "reference_only",
  category: "living_room",
  description: "",
  woodType: "",
  priceMin: "",
  priceMax: "",
  stockQuantity: "0",
  isFeatured: false,
  images: [], // [{ url: string, sortOrder: number }]
};

// Converts a product document (from the DB) into the shape our form state
// expects — mainly coercing numbers to strings for controlled inputs.
function productToFormState(product) {
  return {
    name: product.name || "",
    listingType: product.listingType || "reference_only",
    category: product.category || "living_room",
    description: product.description || "",
    woodType: product.woodType || "",
    priceMin: product.priceMin ? String(product.priceMin) : "",
    priceMax: product.priceMax ? String(product.priceMax) : "",
    stockQuantity: product.stockQuantity != null ? String(product.stockQuantity) : "0",
    isFeatured: product.isFeatured || false,
    images: product.images || [],
  };
}

export default function ProductForm({ mode, product, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // When switching between edit targets (or add→edit), reset the form.
  useEffect(() => {
    if (mode === "edit" && product) {
      setForm(productToFormState(product));
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [mode, product?._id]);

  function handleChange(e) {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  }

  function addImage() {
    const url = newImageUrl.trim();
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { url, sortOrder: prev.images.length }],
    }));
    setNewImageUrl("");
  }

  function removeImage(index) {
    setForm((prev) => ({
      ...prev,
      images: prev.images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, sortOrder: i })),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Convert price strings back to integers (smallest currency unit).
    // Empty string → undefined so the field isn't sent at all, letting
    // Mongoose keep the existing value on edits.
    const payload = {
      name: form.name,
      listingType: form.listingType,
      category: form.category,
      description: form.description,
      woodType: form.woodType,
      isFeatured: form.isFeatured,
      images: form.images,
      ...(form.priceMin !== "" && { priceMin: parseInt(form.priceMin, 10) }),
      ...(form.priceMax !== "" && { priceMax: parseInt(form.priceMax, 10) }),
      ...(form.listingType === "ready_made" && {
        stockQuantity: parseInt(form.stockQuantity, 10) || 0,
      }),
    };

    try {
      const url =
        mode === "edit"
          ? `/api/admin/products/${product._id}`
          : "/api/admin/products";

      const res = await fetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  const fieldLabel =
    "block text-[0.72rem] font-semibold tracking-[0.04em] uppercase text-charcoal/50 mb-1";
  const fieldInput =
    "w-full px-3 py-2 border-[1.5px] border-walnut/20 bg-cream-soft rounded-sm text-sm text-charcoal focus:outline-2 focus:outline-sienna focus:border-sienna disabled:opacity-60";

  return (
    <div className="bg-white border border-walnut/15 rounded-sm p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-lg text-walnut-deep">
          {mode === "add" ? "Add Product" : "Edit Product"}
        </h2>
        <button
          onClick={onClose}
          className="text-charcoal/40 hover:text-charcoal text-lg leading-none"
          aria-label="Close form"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className={fieldLabel}>
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            disabled={saving}
            className={fieldInput}
            placeholder="e.g. Heritage Sofa Set"
          />
        </div>

        {/* Listing type + Category — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="listingType" className={fieldLabel}>
              Listing Type *
            </label>
            <select
              id="listingType"
              value={form.listingType}
              onChange={handleChange}
              disabled={saving}
              className={fieldInput}
            >
              <option value="reference_only">Reference / Portfolio</option>
              <option value="ready_made">Ready-made (for sale)</option>
            </select>
          </div>
          <div>
            <label htmlFor="category" className={fieldLabel}>
              Category *
            </label>
            <select
              id="category"
              value={form.category}
              onChange={handleChange}
              disabled={saving}
              className={fieldInput}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wood type */}
        <div>
          <label htmlFor="woodType" className={fieldLabel}>
            Wood Type
          </label>
          <input
            id="woodType"
            type="text"
            value={form.woodType}
            onChange={handleChange}
            disabled={saving}
            className={fieldInput}
            placeholder="e.g. Sheesham, Teak, Sal"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={fieldLabel}>
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={handleChange}
            disabled={saving}
            rows={3}
            className={`${fieldInput} resize-none`}
            placeholder="Brief description of the piece…"
          />
        </div>

        {/* Price range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="priceMin" className={fieldLabel}>
              Min Price (Rs.)
            </label>
            <input
              id="priceMin"
              type="number"
              min="0"
              value={form.priceMin}
              onChange={handleChange}
              disabled={saving}
              className={fieldInput}
              placeholder="e.g. 25000"
            />
          </div>
          <div>
            <label htmlFor="priceMax" className={fieldLabel}>
              Max Price (Rs.)
            </label>
            <input
              id="priceMax"
              type="number"
              min="0"
              value={form.priceMax}
              onChange={handleChange}
              disabled={saving}
              className={fieldInput}
              placeholder="e.g. 35000"
            />
          </div>
        </div>
        <p className="text-[0.72rem] text-charcoal/40 -mt-2">
          Enter the price in full rupees — it will be stored correctly.
        </p>

        {/* Stock — only shown for ready-made */}
        {form.listingType === "ready_made" && (
          <div>
            <label htmlFor="stockQuantity" className={fieldLabel}>
              Stock Quantity
            </label>
            <input
              id="stockQuantity"
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={handleChange}
              disabled={saving}
              className={fieldInput}
            />
          </div>
        )}

        {/* Featured toggle */}
        <div className="flex items-center gap-3 py-1">
          <input
            id="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={handleChange}
            disabled={saving}
            className="w-4 h-4 accent-sienna cursor-pointer"
          />
          <label htmlFor="isFeatured" className="text-sm text-charcoal cursor-pointer">
            Show as Featured on the storefront
          </label>
        </div>

        {/* Images */}
        <div>
          <p className={fieldLabel}>Images</p>
          {form.images.length > 0 && (
            <div className="space-y-2 mb-2">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-cream rounded-sm px-3 py-2"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-10 h-10 object-cover rounded-sm flex-none"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span className="text-xs text-charcoal/60 flex-1 truncate">
                    {img.url}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex-none"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
              disabled={saving}
              className={`${fieldInput} flex-1`}
              placeholder="Paste image URL and press Add"
            />
            <button
              type="button"
              onClick={addImage}
              disabled={saving || !newImageUrl.trim()}
              className="text-sm font-semibold px-3 py-2 border border-walnut/25 rounded-sm text-walnut hover:bg-cream transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>
          <p className="text-[0.72rem] text-charcoal/40 mt-1">
            For now, paste Unsplash or hosted image URLs. File upload (Cloudinary) comes in a later step.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-sienna-dark bg-sienna/10 border border-sienna/30 rounded-sm px-3 py-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-sienna text-cream-soft font-semibold text-sm py-2.5 rounded-sm hover:bg-sienna-dark transition-colors duration-200 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : mode === "add"
              ? "Add Product"
              : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 text-sm font-semibold border border-walnut/25 text-charcoal/70 rounded-sm hover:bg-cream transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
