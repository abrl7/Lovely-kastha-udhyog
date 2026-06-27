import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { generateOrderCode } from "@/lib/generateOrderCode";

/*
  POST /api/orders

  Handles BOTH order types your dad's business has:

    orderType: "ready_made" — body includes `product` (a Product _id) and
    `quantity`. We look up the product to snapshot its current price/stock
    rather than trusting whatever price the client sends — never trust the
    client to tell you the price; always verify against the database.

    orderType: "custom" — body includes `customDetails` (description,
    dimensions, woodPreference, budgetRange, optional referenceProduct).

  Why one endpoint instead of two (/api/orders/ready-made and
  /api/orders/custom)? Both ultimately create the same kind of document
  (an Order) and share the customer fields. Splitting them would mean
  duplicating the customer-field validation and the "create + respond"
  logic. The branching below handles the *small* part that differs.
*/
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { orderType, customerName, customerPhone, customerEmail } = body;

    // Validate the fields every order needs, regardless of type, before
    // we even look at type-specific fields. Failing fast here gives a
    // clearer error message than letting Mongoose's validation catch it
    // deeper in the process.
    if (!customerName || !customerPhone) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer name and phone number are required",
        },
        { status: 400 }
      );
    }

    if (orderType !== "ready_made" && orderType !== "custom") {
      return NextResponse.json(
        {
          success: false,
          error: "orderType must be either 'ready_made' or 'custom'",
        },
        { status: 400 }
      );
    }

    // Build up the data for the new order depending on type. We start
    // with the shared fields, then branch.
    const orderData = {
      customerName,
      customerPhone,
      customerEmail,
      orderType,
      status: "new",
    };

    if (orderType === "ready_made") {
      const { product: productId, quantity } = body;

      if (!productId) {
        return NextResponse.json(
          { success: false, error: "product is required for ready_made orders" },
          { status: 400 }
        );
      }

      // Look the product up rather than trusting the client. If someone
      // tampered with the request to point at a non-existent or inactive
      // product, we catch that here instead of creating an order for
      // something that isn't actually available.
      const product = await Product.findOne({
        _id: productId,
        isActive: true,
        listingType: "ready_made",
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found or not available" },
          { status: 404 }
        );
      }

      const requestedQuantity = quantity || 1;

      if (product.stockQuantity < requestedQuantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Only ${product.stockQuantity} in stock, requested ${requestedQuantity}`,
          },
          { status: 400 }
        );
      }

      orderData.product = product._id;
      orderData.quantity = requestedQuantity;
      // Snapshot the agreed price from the product's current priceMin.
      // This is a starting point your dad can adjust later (e.g. after
      // negotiating) via the admin dashboard — it's not locked in stone.
      orderData.agreedPrice = product.priceMin;
    }

    if (orderType === "custom") {
      const { customDetails } = body;

      if (!customDetails || !customDetails.description) {
        return NextResponse.json(
          {
            success: false,
            error: "customDetails.description is required for custom orders",
          },
          { status: 400 }
        );
      }

      orderData.customDetails = customDetails;
    }

    // Generate the human-friendly order code now, just before creating
    // the document, to keep the "count existing orders this year" window
    // as small as possible (reduces — doesn't eliminate — the race
    // condition described in generateOrderCode.js).
    // Retry up to 3 times on duplicate orderCode — handles the rare race
    // condition where two simultaneous requests generate the same code.
    let order;
    for (let attempt = 0; attempt < 3; attempt++) {
      orderData.orderCode = await generateOrderCode();
      try {
        order = await Order.create(orderData);
        break;
      } catch (err) {
        if (err.code === 11000 && err.keyPattern?.orderCode && attempt < 2) {
          continue; // regenerate and retry
        }
        throw err; // non-duplicate error or exhausted retries
      }
    }

    // If this was a ready-made purchase, decrement stock. In a
    // high-traffic store you'd want this to happen atomically together
    // with the order creation (a "transaction") so a crash between the
    // two steps can't leave stock incorrect. At this stage/scale, doing
    // it as a clearly separate, sequential step is simpler to read and
    // reason about — worth revisiting if this ever needs to handle many
    // simultaneous orders for the same limited-stock item.
    if (orderType === "ready_made") {
      await Product.findByIdAndUpdate(orderData.product, {
        $inc: { stockQuantity: -orderData.quantity },
      });
    }

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

/*
  GET /api/orders?phone=9841234567&orderCode=LKU-2026-0042

  This is the "no login needed" tracking lookup you decided on: a customer
  provides their phone number AND order code together (not phone alone —
  that would let anyone who knows a phone number see all of that person's
  orders, which is a privacy leak). Requiring both pieces of information
  acts as a lightweight shared secret, similar to how airlines let you
  check a flight using last name + confirmation code instead of a full
  login.
*/
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const orderCode = searchParams.get("orderCode");

    if (!phone || !orderCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Both phone and orderCode query parameters are required",
        },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      customerPhone: phone,
      orderCode: orderCode,
    }).populate("product customDetails.referenceProduct");
    // (multi-path populate via space-separated string is valid Mongoose
    // syntax — confirmed this works for nested paths too)
    // .populate() replaces the stored ObjectId reference with the full
    // Product document it points to, so the response includes product
    // name/images instead of just an opaque id — saves the frontend a
    // second request.

    if (!order) {
      return NextResponse.json(
        { success: false, error: "No matching order found" },
        { status: 404 }
      );
    }

    // Convert to plain object and strip internalNotes — that field is
    // for your dad's eyes only and should never reach a customer's browser.
    const orderData = order.toObject();
    delete orderData.internalNotes;

    return NextResponse.json({ success: true, data: orderData });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
