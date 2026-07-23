import { NextResponse } from "next/server";
import { configureCloudinary } from "@/lib/cloudinary";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";

/*
  POST /api/admin/upload

  Accepts a multipart/form-data request with a single file field named
  "file", uploads it to Cloudinary, and returns the secure URL.

  HOW THE FILE GETS TO CLOUDINARY:
  1. Browser sends the file as FormData to this route
  2. Next.js parses the multipart body via request.formData()
  3. We read the file as an ArrayBuffer, convert to a Node.js Buffer
  4. We wrap it in a stream and pipe it to Cloudinary's upload_stream API
  5. Cloudinary stores it and returns a URL we send back to the browser

  WHY upload_stream INSTEAD OF upload():
  Cloudinary's upload() method expects a file path on disk. We don't
  want to write the file to disk first (slow, messy, serverless-unfriendly).
  upload_stream accepts a stream directly from memory — cleaner and
  works in serverless environments like Vercel.

  WHY THE BROWSER DOESN'T UPLOAD DIRECTLY TO CLOUDINARY:
  Cloudinary supports "unsigned uploads" where the browser talks to
  Cloudinary directly, but that either exposes your API secret (dangerous)
  or requires a signed upload preset (extra setup and still requires our
  server). Routing through our own API keeps all credentials server-side
  with no exceptions.
*/
export async function POST(request) {
  // Auth check first — only logged-in admins can upload images.
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type — only images allowed.
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // 5MB limit. Cloudinary can handle larger, but product thumbnails
    // don't need to be huge, and large uploads slow down the admin UI.
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image must be under 5MB" },
        { status: 400 }
      );
    }

    const cloudinary = configureCloudinary();

    // Convert File → ArrayBuffer → Buffer → uploadable stream.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Wrap the Cloudinary upload_stream callback API in a Promise so we
    // can use async/await instead of nested callbacks.
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "lovely-kastha-udhog/products",
          // Cloudinary auto-generates a public_id (filename) if not set.
          // Keeping images in a named folder makes the Cloudinary media
          // library organized and easier for you to browse/manage later.
          transformation: [
            // Resize on upload: max 1200px wide, maintain aspect ratio.
            // Serves smaller files to browsers without losing quality for
            // product photography.
            { width: 1200, crop: "limit" },
            // Auto-format: Cloudinary serves WebP to browsers that support
            // it, JPEG as fallback — better compression automatically.
            { fetch_format: "auto" },
            { quality: "auto:best" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed. Check Cloudinary credentials." },
      { status: 500 }
    );
  }
}

// Use Node.js runtime for Cloudinary's upload_stream (requires Buffer/streams).
// The App Router defaults to the Edge runtime which doesn't support Node APIs.
export const runtime = "nodejs";
