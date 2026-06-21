import mongoose from "mongoose";

/*
  PRODUCT MODEL

  This single schema covers two roles your dad's business needs:

    1. READY-MADE ITEMS — real stock, sitting in the workshop, that a
       customer can buy as-is. These have a `stockQuantity`.

    2. REFERENCE / PORTFOLIO ITEMS — pieces shown on the custom-order page
       as inspiration ("I want something like this, but bigger"). These
       aren't for sale directly; stockQuantity is irrelevant for them.

  Why one schema instead of two separate models? Both "types" share almost
  every field (name, images, wood type, description). The only real
  difference is whether it's purchasable stock or just a display piece —
  that's a single boolean/enum distinction, not a structural one. Splitting
  this into two collections would mean duplicating the schema and writing
  near-identical queries twice. The `listingType` field below captures the
  distinction cleanly.

  If later this product genuinely needs very different fields per type
  (e.g. ready-made needs SKU/barcode, custom-reference needs something
  else entirely), revisit splitting them — but starting unified avoids
  premature complexity here.
*/

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false } // small subdocument, don't need its own _id
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    // Controls where/how this product appears in the app.
    listingType: {
      type: String,
      enum: ["ready_made", "reference_only"],
      required: true,
      default: "reference_only",
    },

    category: {
      type: String,
      enum: ["living_room", "bedroom", "dining", "office", "custom", "other"],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    woodType: {
      type: String,
      trim: true,
    },

    // Stored in smallest currency unit (e.g. paisa/cents) to avoid
    // floating point rounding issues with money. Divide by 100 when
    // displaying. Only meaningful for ready_made; for reference_only
    // these represent a rough "starting from" estimate.
    priceMin: {
      type: Number,
      min: 0,
    },
    priceMax: {
      type: Number,
      min: 0,
    },

    // Only relevant when listingType is 'ready_made'. A reference-only
    // piece doesn't track stock since it's not literally for sale.
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: [productImageSchema],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Soft-delete flag. Why not just delete the document? Because orders
    // may reference this product (see Order.customDetails.referenceProduct
    // in order.model.js). Deleting the product out from under an existing
    // order's reference would break that link. Marking inactive instead
    // keeps history intact while hiding it from the storefront.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Adds createdAt and updatedAt automatically — one less thing to
    // manage by hand, and you get them for free with Mongoose.
    timestamps: true,
  }
);

// Index to speed up the most common storefront query: "show me active,
// featured items in category X." Without an index, Mongo scans every
// document; with one, it can jump straight to matches. Not critical at
// small scale, but it's a good habit and costs nothing to add now.
productSchema.index({ category: 1, isActive: 1 });

// Avoids the "Cannot overwrite model" error that happens when Next.js
// hot-reloads this file in development — Mongoose would otherwise try to
// redefine the model on every reload. This checks if it already exists
// first and reuses it.
export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
