import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";

/*
  WHY THIS FILE IS NAMED route.js AND EXPORTS GET/POST:
  Next.js App Router maps URL paths to folders. This file living at
  app/api/products/route.js means it handles requests to /api/products.
  Within it, you export a function named after the HTTP method you want
  to handle — GET for reading, POST for creating, etc. This is different
  from Express, where you'd write something like:
    app.get('/api/products', (req, res) => {...})
    app.post('/api/products', (req, res) => {...})
  Next.js achieves the same routing through file structure + named
  exports instead of explicit route registration.
*/

// GET /api/products
// GET /api/products?category=dining
// GET /api/products?listingType=ready_made
//
// Used by: the catalog/ready-made page, and the custom-order page (to show
// reference pieces as inspiration).
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const listingType = searchParams.get("listingType");

    // Build the filter object incrementally. We always filter to active
    // products only — soft-deleted (isActive: false) products should
    // never appear on the public storefront, only in admin views that
    // explicitly ask for them (a feature we'll add when we build the
    // admin product management screen).
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }
    if (listingType) {
      filter.listingType = listingType;
    }

    // .sort({ isFeatured: -1, createdAt: -1 }) puts featured items first,
    // then newest-first within each group — a reasonable default for a
    // catalog page without the caller having to specify sorting.
    const products = await Product.find(filter).sort({
      isFeatured: -1,
      createdAt: -1,
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products
// Creates a new catalog product. Used by the admin dashboard to add new
// ready-made or reference items. PROTECTED — requires a valid admin
// session, since anyone able to hit this endpoint freely could control
// what the public storefront displays.
export async function POST(request) {
  try {
    // Auth check happens FIRST, before connecting to the DB or touching
    // the request body — no reason to do any work at all for a request
    // we're going to reject anyway.
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Mongoose will run the schema's `required`/`enum` validations
    // automatically on .create() — if `name` or `category` is missing,
    // or category isn't one of the allowed enum values, this throws a
    // ValidationError that we catch below and turn into a clean 400.
    const product = await Product.create(body);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);

    // Mongoose validation errors have a distinct name we can check for,
    // letting us return a 400 (client's fault: bad input) instead of a
    // 500 (server's fault) — an important distinction for whoever
    // consumes this API, including future-you debugging it.
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
