import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Session from "@/models/Session";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  generateSessionToken,
  hashSessionToken,
  getSessionCookieOptions,
} from "@/lib/session";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // .select('+passwordHash') is required here because the Admin schema
    // sets `select: false` on that field (see models/Admin.js) — without
    // this, admin.passwordHash would be undefined and comparePassword
    // would always fail.
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    }).select("+passwordHash");

    // IMPORTANT: we return the exact same error message whether the
    // email doesn't exist OR the password is wrong. If we said "no
    // account with that email" vs "wrong password" as distinct messages,
    // an attacker could use that difference to discover which email
    // addresses have admin accounts at all (a privacy/security leak
    // called "user enumeration"). One generic message closes that gap.
    const genericError = "Invalid email or password";

    if (!admin) {
      return NextResponse.json(
        { success: false, error: genericError },
        { status: 401 }
      );
    }

    const passwordMatches = await admin.comparePassword(password);
    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: genericError },
        { status: 401 }
      );
    }

    const rawToken = generateSessionToken();
    const tokenHash = hashSessionToken(rawToken);

    await Session.create({
      admin: admin._id,
      tokenHash,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    });

    cookies().set(
      SESSION_COOKIE_NAME,
      rawToken,
      getSessionCookieOptions()
    );

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
