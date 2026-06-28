"use client";

import { useState, useEffect, useRef } from "react";

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
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // separate from saving — tracks image upload in progress
  const [error, setError] = useState("");
  const fileInputRef = useRef(null); // ref to the hidden file input so we can trigger it from a styled button

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

  function removeImage(index) {
    setForm((prev) => ({
      ...prev,
      images: prev.images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, sortOrder: i })),
    }));
  }

  function moveImage(index, direction) {
    setForm((prev) => {
      const imgs = [...prev.images];
      const swapWith = index + direction;
      if (swapWith < 0 || swapWith >= imgs.length) return prev;
      [imgs[index], imgs[swapWith]] = [imgs[swapWith], imgs[index]];
      return { ...prev, images: imgs.map((img, i) => ({ ...img, sortOrder: i })) };
    });
  }

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setError("");

    // Upload each selected file sequentially (not parallel) to avoid
    // hammering the server with simultaneous requests. For a typical
    // product with 3-5 photos this is fast enough; parallel would add
    // complexity for minimal real benefit here.
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
          // DO NOT set Content-Type header manually — the browser must
          // set it automatically so it includes the multipart boundary
          // string. Setting it manually breaks the multipart parsing.
        });

        const result = await res.json();

        if (!result.success) {
          throw new Error(result.error || "Upload failed");
        }

        // Append the returned Cloudinary URL to the images array.
        setForm((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            { url: result.data.url, sortOrder: prev.images.length },
          ],
        }));
      } catch (err) {
        setError(`Failed to upload "${file.name}": ${err.message}`);
        break; // stop uploading remaining files if one fails
      }
    }

    setUploading(false);
    // Reset the file input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  // Block form interactions while either saving or uploading an image
  const isBusy = saving || uploading;

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
            disabled={isBusy}
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
              disabled={isBusy}
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
              disabled={isBusy}
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
            disabled={isBusy}
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
            disabled={isBusy}
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
              disabled={isBusy}
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
              disabled={isBusy}
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
              disabled={isBusy}
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
            disabled={isBusy}
            className="w-4 h-4 accent-sienna cursor-pointer"
          />
          <label htmlFor="isFeatured" className="text-sm text-charcoal cursor-pointer">
            Show as Featured on the storefront
          </label>
        </div>

        {/* Images */}
        <div>
          <p className={fieldLabel}>Images</p>

          {/* Uploaded images list */}
          {form.images.length > 0 && (
            <div className="space-y-2 mb-3">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-cream rounded-sm px-3 py-2"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-12 h-12 object-cover rounded-sm flex-none"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={isBusy || i === 0}
                      className="text-[0.65rem] text-charcoal/40 hover:text-charcoal leading-none disabled:opacity-20"
                      aria-label="Move up"
                    >▲</button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={isBusy || i === form.images.length - 1}
                      className="text-[0.65rem] text-charcoal/40 hover:text-charcoal leading-none disabled:opacity-20"
                      aria-label="Move down"
                    >▼</button>
                  </div>
                  <span className="text-xs text-charcoal/60 flex-1 truncate">
                    {i === 0 && <span className="text-[0.68rem] font-semibold text-brass mr-1">Cover</span>}
                    {img.url.split("/").pop()}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    disabled={isBusy}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex-none disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hidden file input triggered by the styled button below.
              `multiple` allows selecting several photos at once. */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload product images"
          />

          {/* Styled upload trigger */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            className={`w-full border-[2px] border-dashed rounded-sm py-5 text-sm font-medium transition-colors duration-150 disabled:opacity-50 ${
              uploading
                ? "border-brass/50 text-brass bg-brass/5"
                : "border-walnut/20 text-charcoal/50 hover:border-walnut/40 hover:text-charcoal/70 hover:bg-cream/50"
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-brass border-t-transparent rounded-full animate-spin" />
                Uploading to Cloudinary…
              </span>
            ) : (
              <span>
                {form.images.length === 0
                  ? "Click to upload images"
                  : "Click to add more images"}
                <span className="block text-xs mt-0.5 font-normal">
                  JPG, PNG, WebP · Max 5MB each · Multiple files OK
                </span>
              </span>
            )}
          </button>
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
            disabled={isBusy}
            className="flex-1 bg-sienna text-cream-soft font-semibold text-sm py-2.5 rounded-sm hover:bg-sienna-dark transition-colors duration-200 disabled:opacity-60"
          >
            {uploading
              ? "Uploading image…"
              : saving
              ? "Saving..."
              : mode === "add"
              ? "Add Product"
              : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="px-4 py-2.5 text-sm font-semibold border border-walnut/25 text-charcoal/70 rounded-sm hover:bg-cream transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
