import { v2 as cloudinary } from "cloudinary";

/*
  Configures the Cloudinary SDK with credentials from environment
  variables. Called once before any upload operation.

  WHY THIS IS A SEPARATE FILE:
  Same reason as lib/mongodb.js — centralising the config means if
  credentials or settings ever change, there's exactly one place to
  update. The upload route imports this rather than calling
  cloudinary.config() inline.

  The credentials MUST stay server-side only (never in client
  components, never in the browser bundle). Next.js only exposes env
  vars prefixed with NEXT_PUBLIC_ to the browser — since ours have no
  prefix, they're server-only by default. Good.
*/
export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}
