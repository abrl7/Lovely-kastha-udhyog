import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; // required for populate() to work
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";

/*
  [id] in the folder name is Next.js dynamic route syntax. This file
  handles requests to /api/admin/orders/<any-mongo-id>, and Next.js
  passes the actual value in the `params` argument.

  We export two handlers:
    GET  /api/admin/orders/:id  — fetch one order with full detail
    PATCH /api/admin/orders/:id — update status and/or internalNotes
*/

// GET /api/admin/orders/:id
export async function GET(request, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const order = await Order.findById(params.id)
      .populate("product")
      .populate("customDetails.referenceProduct");

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("GET /api/admin/orders/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/orders/:id
// Permanently removes an order. Only appropriate for fully resolved
// orders (delivered or cancelled) that are no longer needed.
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

    const order = await Order.findByIdAndDelete(params.id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/orders/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/orders/:id
// Accepts: { status, internalNotes }
// Both are optional — send only the fields you want to change.
//
// We use PATCH (partial update), not PUT (full replace). PUT would
// require sending the entire order object even to change one field —
// that's risky (easy to accidentally blank out a field you didn't
// include) and wasteful. PATCH is the right verb for "update a subset
// of fields on an existing resource."
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
    const { status, internalNotes, confirmedMeasurements, statusNote, activityNote } = body;

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (status !== undefined) order.status = status;
    if (internalNotes !== undefined) order.internalNotes = internalNotes;
    if (confirmedMeasurements !== undefined && order.customDetails) {
      order.customDetails.confirmedMeasurements = confirmedMeasurements;
    }
    // Pass through to pre-save hook which writes it into statusHistory + activityLog
    if (statusNote) order._statusNote = statusNote;

    // Manual log entry — appended directly, no status change required
    if (activityNote?.trim()) {
      order.activityLog.push({ message: activityNote.trim(), createdAt: new Date() });
    }

    await order.save(); // triggers pre('save') hook for statusHistory

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("PATCH /api/admin/orders/:id error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
