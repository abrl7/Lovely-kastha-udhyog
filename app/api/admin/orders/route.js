import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; // must be imported so Mongoose registers the schema before populate() runs
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";

/*
  GET /api/admin/orders
  GET /api/admin/orders?status=in_production
  GET /api/admin/orders?status=new&orderType=custom

  WHY A SEPARATE ADMIN ROUTE INSTEAD OF REUSING GET /api/orders?
  The public GET /api/orders requires phone + orderCode (a customer
  looking up their own order). This admin route returns ALL orders,
  sorted and filterable, with full details — clearly different access
  levels. Keeping them as separate routes makes the permission boundary
  explicit: /api/orders is public, /api/admin/* is always protected.
  No risk of accidentally forgetting an auth check on a route that
  should be public, or vice versa.
*/
export async function GET(request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const orderType = searchParams.get("orderType");

    const filter = {};
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .populate("product", "name images priceMin") // only the fields the list view actually needs
      .populate("customDetails.referenceProduct", "name images");

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
