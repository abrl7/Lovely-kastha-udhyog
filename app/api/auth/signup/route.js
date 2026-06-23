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

/*
  POST /api/auth/signup

  Creates a new Admin account. Gated by ADMIN_SIGNUP_SECRET so this isn't
  truly "public" signup — see the comment in .env.example for why. Anyone
  without the secret gets a 403 before we even look at the rest of the
  request body.

  On success, we also immediately create a session and log the new admin
  in — no reason to make them sign up and then separately log in right
  after; that's just friction for the same outcome.
*/
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password, signupSecret } = body;

    // Check the gate FIRST, before touching the database at all. This
    // means someone probing this endpoint without the secret can't learn
    // anything about existing accounts (e.g. via timing or validation
    // error differences) — they get the exact same 403 regardless of
    // what else they sent.
    if (
      !process.env.ADMIN_SIGNUP_SECRET ||
      signupSecret !== process.env.ADMIN_SIGNUP_SECRET
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid signup secret" },
        { status: 403 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "An admin with this email already exists" },
        { status: 409 } // 409 Conflict — the resource already exists
      );
    }

    const passwordHash = await Admin.hashPassword(password);

    const admin = await Admin.create({
      name,
      email,
      passwordHash,
    });

    // --- Log the new admin in immediately ---
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

    // Deliberately exclude passwordHash from the response even though we
    // never selected it (select: false on the schema already prevents
    // that) — being explicit here is a second layer of safety, not
    // redundant.
    return NextResponse.json(
      {
        success: true,
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create admin account" },
      { status: 500 }
    );
  }
}
