import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";

// PATCH /api/admin/products/:id
// Partial update — send only the fields you want to change.
export async function PATCH(request, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const body = await request.json();

    // Unlike orders (where we need the pre-save hook to fire for status
    // history), products have no hooks that require .save() — so
    // findByIdAndUpdate with { new: true } is cleaner here: one round-
    // trip to the DB instead of two (findById + save), and it returns
    // the updated document directly.
    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
      // runValidators: true means Mongoose still runs schema validations
      // (enum checks, required fields) on the update, which it skips by
      // default on findByIdAndUpdate — important so the category enum
      // and other constraints stay enforced even on edits.
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("PATCH /api/admin/products/:id error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/:id
// Soft delete only — sets isActive: false instead of removing the
// document. Hard deleting would break any Order that references this
// product via order.product or customDetails.referenceProduct. Those
// orders would then have a dangling reference that .populate() can't
// resolve, which causes errors in the order detail view. Soft delete
// keeps the document (and the reference) intact while hiding it from
// the public storefront.
export async function DELETE(request, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deactivated successfully",
      data: product,
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to deactivate product" },
      { status: 500 }
    );
  }
}
