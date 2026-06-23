import crypto from "crypto";

/*
  Shared helpers for session token creation/verification. Centralizing
  this means login, signup, logout, and the auth-check helper all agree
  on exactly how tokens are generated and hashed — if this logic were
  copy-pasted into each route instead, they could drift out of sync.
*/

export const SESSION_COOKIE_NAME = "lku_admin_session";

// 30 days, expressed in milliseconds. A long-ish expiry is reasonable
// here because this is a low-traffic internal admin tool your dad needs
// to access easily, not a banking app — but it's a deliberate choice,
// not an oversight, and easy to shorten later via this one constant.
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

// Generates a cryptographically random raw token. crypto.randomBytes
// (not Math.random!) is essential here — Math.random is NOT
// cryptographically secure and its output can, in principle, be
// predicted, which would make session tokens guessable. randomBytes
// pulls from the operating system's secure random source.
export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

// One-way hash of the raw token, for storing in the database (see the
// comment in models/Session.js for why we never store the raw token).
// SHA-256 is appropriate here — unlike password hashing, this doesn't
// need to be deliberately slow (bcrypt-style), because the input being
// hashed is already a high-entropy random 32-byte value, not a
// human-guessable password. There's nothing for an attacker to
// brute-force; the security comes from the token being unguessable in
// the first place.
export function hashSessionToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// Shared cookie settings used whenever we set the session cookie.
export function getSessionCookieOptions() {
  return {
    httpOnly: true, // JavaScript in the browser cannot read this cookie — blocks XSS-based token theft.
    secure: process.env.NODE_ENV === "production", // HTTPS-only in production; allows plain http for local dev.
    sameSite: "lax", // sent on normal navigation/same-site requests, blocks most cross-site request forgery vectors.
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000, // cookie maxAge is in seconds, not ms.
  };
}
