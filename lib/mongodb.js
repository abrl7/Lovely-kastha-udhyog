import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Add it to .env.local — see .env.example."
  );
}

/*
  WHY THIS CACHING PATTERN EXISTS:

  In development, Next.js hot-reloads your code on every file save. Without
  caching, each reload would call mongoose.connect() again, opening a new
  connection on top of old ones that never got closed — eventually you hit
  "too many connections" errors.

  In production on serverless platforms (Vercel etc.), each function
  invocation could otherwise create its own connection from scratch, which
  is slow and wasteful.

  The fix: stash the connection (or the in-progress connection promise) on
  the global object, which Node.js preserves across hot-reloads within the
  same process. Next time this file runs, we reuse what's already there
  instead of connecting again.
*/

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
