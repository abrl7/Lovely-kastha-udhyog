import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";

/*
  GET /api/auth/me

  Used by the frontend on page load to answer "is someone logged in right
  now, and who?" — e.g. to decide whether to show the admin dashboard or
  redirect to the login page, and to display "Welcome back, [name]."

  Deliberately returns 200 with data: null when not logged in, rather than
  401. A 401 would technically also be defensible, but this endpoint's
  whole job is to answer the question "are you logged in," so "no" is a
  normal, successful answer to that question — not an error.
*/
export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ success: true, data: null });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
}
