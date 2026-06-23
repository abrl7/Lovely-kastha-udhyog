import mongoose from "mongoose";

/*
  ORDER MODEL

  This is the most important collection in the app — every customer
  interaction that isn't "just browsing" ends up as a document here,
  whether they bought a ready-made item or requested a custom piece.

  DESIGN DECISION: one Order model, not two.
  Your dad thinks of these as one thing: "a customer wants something from
  me." A unified model means one admin screen, one status pipeline, one
  place to look. The `orderType` field tells us which kind it is, and
  `customDetails` only gets populated when it's relevant.

  DESIGN DECISION: status history as an embedded array, not a separate
  collection.
  In a SQL database you'd likely make a separate `order_status_history`
  table with a foreign key back to orders, then JOIN to read it. MongoDB
  encourages a different default: if data is always read together with
  its parent and never queried independently, embed it as a subdocument
  array. We always want "this order's history" together with "this
  order" — we never query "give me all status-history entries across all
  orders" on their own. So embedding avoids an unnecessary lookup/join.
*/

// Each entry is a snapshot: "at this time, the order moved to this
// status, and here's an optional note about why."
const statusHistoryEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        "new",
        "confirmed",
        "measurement_scheduled",
        "measurement_done",
        "in_production",
        "ready",
        "delivered",
        "cancelled",
      ],
    },
    note: {
      type: String,
      trim: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Photos attached to an order — could be the customer's inspiration photo,
// a progress shot your dad takes mid-build, or a final delivery photo.
// Modeled as an array with a `type` tag rather than three separate fields
// (referenceImage, progressImage, finalImage) because there can be
// multiple of each — a customer might upload 3 inspiration photos, and
// your dad might add 5 progress shots over the build.
const orderImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    imageType: {
      type: String,
      enum: ["reference", "progress", "final"],
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Only populated when orderType is 'custom'. Kept as a nested object
// rather than flattening these fields onto the top-level Order, so it's
// visually and structurally clear which fields belong to the custom flow.
const customDetailsSchema = new mongoose.Schema(
  {
    // If the customer started from a catalog/reference piece ("like this
    // one, but...") we link back to it. Optional — they might describe
    // something from scratch with no reference at all.
    referenceProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // Free text on purpose at this stage. Real intake conversations are
    // loose ("about 6 feet, dark wood like teak") — forcing structured
    // numeric fields (length, width, height + unit) too early would fight
    // against how customers actually describe what they want. Revisit
    // this once you see what data actually comes in through the form.
    description: {
      type: String,
      required: [true, "Please describe the custom piece you'd like"],
      trim: true,
    },
    dimensions: {
      type: String,
      trim: true,
    },
    woodPreference: {
      type: String,
      trim: true,
    },
    budgetRange: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Short, human-friendly identifier. Why not just use Mongo's default
    // _id (e.g. 64f1a2b3c9d4e5f6a7b8c9d0) for the "give the admin your
    // order ID over the phone" lookup flow? Because that string is
    // unreadable to read aloud or text. orderCode is generated separately
    // (see lib/generateOrderCode.js once we build the API route) in a
    // format like LKU-2026-0042.
    orderCode: {
      type: String,
      required: true,
      unique: true,
    },

    orderType: {
      type: String,
      enum: ["ready_made", "custom"],
      required: true,
    },

    // For now: just name + phone, no customer accounts (per your current
    // decision). This is intentionally a plain embedded object, not a
    // reference to a separate Customer collection — there's no Customer
    // collection yet because there's no login system yet. When you add
    // customer accounts later, this is the natural seam: add a
    // `customer: { type: ObjectId, ref: 'Customer' }` field alongside
    // (or instead of) this one.
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Only present for orderType: 'ready_made'.
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Only present for orderType: 'custom'.
    customDetails: {
      type: customDetailsSchema,
      default: null,
    },

    images: [orderImageSchema],

    status: {
      type: String,
      enum: [
        "new",
        "confirmed",
        "measurement_scheduled",
        "measurement_done",
        "in_production",
        "ready",
        "delivered",
        "cancelled",
      ],
      default: "new",
    },
    statusHistory: [statusHistoryEntrySchema],

    // Filled in once your dad and the customer agree on a final price —
    // often different from the catalog priceMin/priceMax estimate, since
    // custom work and negotiation are normal in this business.
    agreedPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    // Private notes for your dad/admin only — never shown to the
    // customer. Different from statusHistory notes, which describe *why*
    // a status changed; this is more like a sticky note ("customer wants
    // delivery before Dashain").
    internalNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Speeds up the two lookups this app will do constantly:
// 1. Admin dashboard listing orders by status ("show me all 'in_production' orders")
// 2. Customer order tracking by phone + order code
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customerPhone: 1 });

// A small piece of schema-level automation: whenever an order is saved
// with a status that differs from its last recorded history entry, push a
// new history entry automatically. This means whoever writes the API
// route later doesn't have to remember to manually update statusHistory
// every time — the model takes care of keeping them in sync.
orderSchema.pre("save", function (next) {
  const order = this;

  const lastEntry = order.statusHistory[order.statusHistory.length - 1];
  const statusChanged = !lastEntry || lastEntry.status !== order.status;

  if (statusChanged) {
    order.statusHistory.push({
      status: order.status,
      changedAt: new Date(),
    });
  }

  next();
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
