import { NextResponse } from "next/server";
import { configureCloudinary } from "@/lib/cloudinary";
import { checkRateLimit } from "@/lib/rateLimit";

// Public image upload endpoint — no admin auth required.
// Used by customers to attach inspiration photos to their inquiry.
// Rate-limited per IP: 10 uploads per hour to prevent abuse.
export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { allowed, retryAfter } = checkRateLimit(`upload:${ip}`, {
    max: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many uploads. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 });
    }

    // 4MB hard limit — Vercel functions reject bodies over 4.5MB total.
    // The client compresses before uploading so real-world payloads are
    // well under this, but we keep a server-side check as a safety net.
    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "Image must be under 4MB" }, { status: 400 });
    }

    const cloudinary = configureCloudinary();
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "lovely-kastha-udhog/customer-reference",
          transformation: [
            { width: 1200, crop: "limit" },
            { fetch_format: "auto" },
            { quality: "auto:good" },
          ],
        },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(buffer);
    });

    return NextResponse.json({ success: true, data: { url: result.secure_url } });
  } catch (err) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";
