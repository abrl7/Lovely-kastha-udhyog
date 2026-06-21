import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/*
  ADMIN MODEL

  This is separate from any future "Customer" model on purpose — admins
  and customers have completely different security requirements (admins
  need strict auth since they control what's shown on the site; customers
  currently need none) and completely different fields. Mixing them into
  one "User" model with a `role` field is a common pattern too, but given
  you explicitly want customer auth to stay simple/deferred while admin
  auth is strict, keeping them as separate models avoids one model
  carrying two very different sets of concerns.

  PASSWORD HANDLING — why hash instead of storing plain text:
  If your database were ever leaked, plain text passwords hand attackers
  everything immediately, and since people reuse passwords, it endangers
  other accounts too. Hashing runs the password through a one-way function
  — easy to compute forward, practically impossible to reverse. bcrypt
  specifically also "salts" automatically (adds random data per password
  before hashing) so two admins with the same password don't produce the
  same hash, and it's deliberately slow, which makes brute-force guessing
  attacks impractically expensive.
*/

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Never store the raw password. This field holds the bcrypt hash
    // only. `select: false` means a normal `Admin.find()` won't return
    // this field at all unless explicitly requested with
    // `.select('+passwordHash')` — an extra safety net so it's harder to
    // accidentally leak password hashes in an API response by forgetting
    // to strip the field manually.
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    // Single admin (your dad) for now, but a role field costs nothing to
    // add today and means you won't need a migration if you later add a
    // shop employee with limited permissions.
    role: {
      type: String,
      enum: ["owner", "staff"],
      default: "owner",
    },
  },
  {
    timestamps: true,
  }
);

// Instance method: lets you call `admin.comparePassword(plaintext)`
// instead of importing bcrypt and writing the compare logic everywhere
// you need to check a password (currently just login, but keeping this
// on the model means there's exactly one place this logic lives).
adminSchema.methods.comparePassword = async function (candidatePassword) {
  // `this.passwordHash` works here even though the schema has
  // `select: false`, because Mongoose includes the field when you call
  // .select('+passwordHash') in the query that loaded this document —
  // we'll do that explicitly in the login API route later.
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static helper to hash a plaintext password before saving — used when
// creating the admin account (e.g. in a one-off seed script), not as a
// pre-save hook. Why not a pre-save hook here? Because we want explicit
// control over when hashing happens, e.g. if we ever update other admin
// fields (like `name`) without touching the password, a pre-save hook
// would need extra logic to detect "did the password actually change."
// Keeping it explicit avoids that footgun while you're still learning
// the patterns.
adminSchema.statics.hashPassword = async function (plainTextPassword) {
  const saltRounds = 10; // higher = slower to compute = more resistant to brute force, but slower logins too. 10 is a common balanced default.
  return bcrypt.hash(plainTextPassword, saltRounds);
};

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
