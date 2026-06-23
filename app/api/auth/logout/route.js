import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import { SESSION_COOKIE_NAME, hashSessionToken } from "@/lib/session";

export async function POST() {
  try {
    await connectDB();

<<<<<<< HEAD
    const cookieStore = cookies();
=======
    const cookieStore = await cookies();
>>>>>>> 4d4ae4a33e2b7a2a33076289f7660c0f9c2494e9
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (rawToken) {
      const tokenHash = hashSessionToken(rawToken);
      // This is the actual revocation — deleting the document means the
      // session is invalid everywhere, immediately, even if the browser
      // somehow still sent the old cookie (e.g. on a second device that
      // doesn't get the cookie-clear below). This is the core advantage
      // of DB-backed sessions over JWT we discussed: logout is real, not
      // just "ignore this token on this one device."
      await Session.deleteOne({ tokenHash });
    }

    // Clearing the cookie on the browser that's actually calling logout
    // right now — belt-and-suspenders alongside the DB deletion above.
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/auth/logout error:", error);
<<<<<<< HEAD
=======
    console.error("LOGOUT ERROR:", error);
>>>>>>> 4d4ae4a33e2b7a2a33076289f7660c0f9c2494e9
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}
