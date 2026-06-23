import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";

// GET /api/admin/products
// Returns ALL products (including inactive) — admins need to see
// deactivated items to reactivate them. The public GET /api/products
// already filters to isActive: true for the storefront.
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const products = await Product.find()
      .sort({ isActive: -1, isFeatured: -1, createdAt: -1 });
    // Sorted: active first, then featured within active, then newest.

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products — same as existing /api/products POST but
// now lives under the /admin/* namespace for consistency. We keep the
// original /api/products POST too (it's already protected by auth).
export async function POST(request) {
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
    const product = await Product.create(body);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/products error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
