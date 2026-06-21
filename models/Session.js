import mongoose from "mongoose";

/*
  SESSION MODEL

  WHY A SEPARATE COLLECTION INSTEAD OF JWT:
  A JWT is a signed token the server hands to the browser and never sees
  again until the browser sends it back — the server doesn't "remember"
  issuing it. That makes JWTs fast to verify (just check the signature)
  but hard to revoke: if you want to force a logout, you'd need a separate
  blocklist of "tokens that are technically still valid but shouldn't
  work anymore," which is extra infrastructure on top of JWT, not less.

  A database-backed session flips this: the server creates a Session
  document and only gives the browser a random ID pointing to it. To log
  someone out, you delete the document — done, immediately, no blocklist
  needed. The cost is an extra database lookup on every authenticated
  request (versus JWT's pure signature check), which is a totally
  reasonable tradeoff at this app's scale.

  WHY STORE A HASH OF THE TOKEN, NOT THE TOKEN ITSELF:
  The raw session token lives in the user's browser cookie. If our
  database were ever leaked, an attacker with read access to this
  collection should NOT be able to take a row and immediately impersonate
  that admin by using it as a valid cookie value. By storing only a hash
  (one-way, like we did with Admin passwords), a database leak alone isn't
  enough to forge a session — this mirrors why we hash passwords instead
  of storing them in plain text in models/Admin.js.
*/

const sessionSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },

  // SHA-256 hash of the random token we actually put in the cookie. See
  // lib/session.js for where the raw token is generated and hashed.
  tokenHash: {
    type: String,
    required: true,
    unique: true,
  },

  // After this time, the session is no longer valid even if the document
  // still exists. We check this on every request rather than relying
  // solely on a TTL index immediately deleting it, because Mongo's TTL
  // background task runs periodically (roughly every 60s), not
  // instantly — there's a small window where an expired-but-not-yet-
  // deleted session could otherwise still pass.
  expiresAt: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// A TTL (time-to-live) index: MongoDB will automatically delete documents
// once `expiresAt` is in the past. This is "cleanup," not the primary
// security check (see comment above) — without it, expired sessions
// would just pile up in the collection forever, taking up space for no
// benefit.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Session ||
  mongoose.model("Session", sessionSchema);
