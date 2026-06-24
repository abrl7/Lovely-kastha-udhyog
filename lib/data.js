import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

/*
  WHY THESE FUNCTIONS EXIST (instead of calling fetch("/api/products"))

  In Next.js App Router, server components run on the server and can
  call the database directly — no HTTP round-trip needed. The API routes
  still exist for the browser (admin dashboard, forms etc.).

  WHY serialize() EXISTS:
  .lean() returns plain JS objects instead of Mongoose documents, but
  MongoDB's ObjectId fields (_id, and any nested refs) are still ObjectId
  *instances*, not plain strings. When Next.js tries to pass these as
  props from a Server Component to a Client Component, it throws:
    "Only plain objects can be passed to Client Components"
  because ObjectId has a toJSON method and isn't a truly plain value.

  serialize() converts the whole document to JSON and back, which:
    1. Converts ObjectId → string (via ObjectId's toJSON/toString)
    2. Converts Date → ISO string
    3. Strips any remaining non-serializable values
  This is the same fix you applied manually — we just centralise it here
  so every data function benefits automatically and no page needs to do it.
*/
function serialize(docs) {
  return JSON.parse(JSON.stringify(docs));
}

export async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();
    return serialize(products);
  } catch (error) {
    console.error("getFeaturedProducts error:", error);
    return [];
  }
}

export async function getReadyMadeProducts(category = null) {
  try {
    await connectDB();
    const filter = { isActive: true, listingType: "ready_made" };
    if (category) filter.category = category;
    const products = await Product.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();
    return serialize(products);
  } catch (error) {
    console.error("getReadyMadeProducts error:", error);
    return [];
  }
}

export async function getAllActiveProducts(category = null) {
  try {
    await connectDB();
    const filter = { isActive: true };
    if (category) filter.category = category;
    const products = await Product.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();
    return serialize(products);
  } catch (error) {
    console.error("getAllActiveProducts error:", error);
    return [];
  }
}

export async function getReferenceProducts(category = null) {
  try {
    await connectDB();
    const filter = { isActive: true, listingType: "reference_only" };
    if (category) filter.category = category;
    const products = await Product.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();
    return serialize(products);
  } catch (error) {
    console.error("getReferenceProducts error:", error);
    return [];
  }
}
