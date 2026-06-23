import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Session from "@/models/Session";
import { SESSION_COOKIE_NAME, hashSessionToken } from "@/lib/session";

/*
  getCurrentAdmin()

  The single source of truth for "who is logged in right now, if anyone."
  Every protected API route calls this first. Centralizing it here means
  the lookup logic — hash the cookie, find the session, check expiry,
  populate the admin — lives in exactly one place. If we ever need to
  change how sessions are verified, this is the only file to touch.

  Returns the Admin document if there's a valid, non-expired session, or
  null otherwise. Deliberately does NOT throw on missing/invalid session —
  "not logged in" is an expected, normal outcome for many callers, not
  an exceptional one, so a null return is easier to work with than a
  try/catch at every call site.
*/
export async function getCurrentAdmin() {
  const rawToken = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  await connectDB();

  const tokenHash = hashSessionToken(rawToken);

  // .populate('admin') replaces the stored admin ObjectId with the full
  // Admin document, so callers get back something immediately useful
  // (admin.name, admin.email) instead of just an id they'd need a
  // second query to resolve.
  const session = await Session.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() }, // only sessions that haven't expired yet
  }).populate("admin");

  if (!session || !session.admin) {
    return null;
  }

  return session.admin;
}
