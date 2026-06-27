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
// Permanently removes the product. Use for products that no longer
// exist in physical inventory. For temporarily unavailable products,
// use PATCH with { isActive: false } to hide from storefront instead.
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

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product permanently deleted",
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
