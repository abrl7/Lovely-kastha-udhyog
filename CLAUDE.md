# Lovely Kastha Udhog — Claude Code Context

This file is read automatically by Claude Code at the start of every session.
It provides full project context so you don't need to re-explain the codebase.

---

## Project overview

E-commerce / showcase website for **Lovely Kastha Udhog (लाभली काष्ठ उद्योग)** — a
Nepali family furniture workshop run by Arpan Shrestha (the user's father).
Built with Next.js 14 App Router, MongoDB/Mongoose, Cloudinary, and Tailwind CSS.

Two customer flows:
1. **Ready-made catalog** — browse products, view detail modal, place a direct order (stock-decrement via MongoDB transaction)
2. **Custom order** — pick a reference product, describe what they want, upload inspiration photos, submit inquiry

Admin panel at `/admin/dashboard` for Arpan to manage all orders.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router |
| Database | MongoDB Atlas via Mongoose |
| Image hosting | Cloudinary |
| Email | Resend (free plan — sends only to `iamabiral007@gmail.com` until a domain is verified) |
| CSS | Tailwind CSS with custom color tokens |
| Deployment | Vercel |
| Auth | Custom session tokens (SHA-256 hash stored in MongoDB, raw token in httpOnly cookie) |

---

## Color tokens (tailwind.config.js)

| Token | Hex | Use |
|---|---|---|
| `walnut` | #4A3528 | primary dark brown |
| `walnut-deep` | #2E2017 | darkest, headers |
| `sienna` | #B5552B | accent / CTA buttons |
| `sienna-dark` | #9B4422 | hover state |
| `brass` | #A8854F | gold accent, labels |
| `cream` | #EFE6D8 | light warm background |
| `cream-soft` | #F7F1E6 | page background |
| `charcoal` | #2B2620 | body text |

---

## Environment variables

All required in Vercel and `.env.local`:

| Variable | Purpose | Required |
|---|---|---|
| `MONGODB_URI` | Atlas connection string with `/lovely-kastha-udhog` DB name | Yes |
| `ADMIN_SIGNUP_SECRET` | Gate for `/admin/signup` — invite-code pattern | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary credentials | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary credentials | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary credentials | Yes |
| `RESEND_API_KEY` | Resend email API key | No (emails skipped if missing) |
| `FROM_EMAIL` | Resend "from" address — must be `onboarding@resend.dev` on free plan | No |
| `ADMIN_EMAIL` | Where new-order notifications go (defaults to `iamabiral007@gmail.com`) | No |
| `NEXT_PUBLIC_SITE_URL` | Live URL for email links and OG metadata | No |

---

## File structure (key files only)

```
app/
  layout.js              — root layout, WhatsApp button, global metadata
  page.js                — homepage, imports all homepage sections
  globals.css            — CSS animations, keyframes, grain-band, marquee

  admin/
    dashboard/page.jsx   — admin order list + stats + search + pagination (client)
    dashboard/products/  — admin product CRUD
    login/page.jsx
    signup/page.jsx

  api/
    orders/route.js      — GET (track) + POST (create) — both order types
    admin/orders/route.js          — GET all orders (admin)
    admin/orders/[id]/route.js     — GET one + PATCH + DELETE
    admin/products/route.js
    admin/products/[id]/route.js
    admin/upload/route.js          — admin image upload (Cloudinary)
    upload/route.js                — PUBLIC image upload for customer reference photos
    auth/login + logout + me + signup

  catalog/page.jsx       — server, fetches products, renders CatalogClient
  custom/page.jsx        — server, fetches products + resolves ?reference=<id>
  track/page.jsx         — client, order tracking by phone + orderCode

components/
  Header.jsx             — fixed nav, transparent on hero / solid on scroll
  Hero.jsx               — parallax background, staggered text reveal
  GrainBand.jsx          — marquee ticker between hero and categories
  Categories.jsx         — horizontal scroll category cards
  Featured.jsx           — asymmetric grid with hover-reveal overlay
  Story.jsx              — dark walnut section, animated stat counters
  CraftsmanPortrait.jsx  — full-width portrait section (dad's photo + quote)
  Process.jsx            — 4 steps with animated connecting line
  Inquiry.jsx            — CTA section linking to /custom
  Footer.jsx
  WhatsAppButton.jsx     — fixed green button with pulse ring animation
  FadeIn.jsx             — scroll-triggered fade animation wrapper
  CatalogClient.jsx      — filter/sort + ProductTile + modals
  ProductDetailModal.jsx — full image carousel + order/reference buttons
  ReadyMadeOrderModal.jsx — name/phone/qty form → POST /api/orders
  CustomOrderClient.jsx  — shared state for reference selection
  ReferenceGrid.jsx      — product grid with carousel, "Use as reference" button
  InquiryForm.jsx        — custom order form + image upload (3 photos max)
  admin/
    OrderDetail.jsx      — right panel: status, agreed price, measurements, activity log, WhatsApp reply
    OrderCard.jsx        — left panel list item
    ProductForm.jsx      — product create/edit with image reordering

hooks/
  useInView.js           — Intersection Observer hook (fires once per element)

lib/
  mongodb.js             — connectDB with connection caching
  cloudinary.js          — configureCloudinary()
  email.js               — sendNewOrderNotification + sendStatusUpdateEmail (Resend)
  rateLimit.js           — in-memory rate limiter (Map-based, auto-purge)
  generateOrderCode.js   — LKU-YYYY-NNNN format, year-scoped sequence
  getCurrentAdmin.js     — reads session cookie, returns admin or null
  session.js             — token generation, hashing, cookie options
  orderConstants.js      — ORDER_STATUSES array shared between client + server
  data.js                — server-side data fetchers (getAllActiveProducts, getFeaturedProducts)

models/
  Order.js               — see schema notes below
  Product.js
  Admin.js
  Session.js
```

---

## Order schema (important details)

```js
orderType: "ready_made" | "custom"

// ready_made only
product: ObjectId → Product
quantity: Number
// stock is decremented atomically via MongoDB transaction (session.withTransaction)

// custom only
customDetails: {
  referenceProduct: ObjectId → Product  // optional
  furnitureType: enum (table|wardrobe|sofa|bed|chair|shelf|other)
  description: String (required)
  dimensions: String
  woodPreference: String
  budgetRange: String
  referenceImages: [String]  // Cloudinary URLs, max 3, uploaded via /api/upload
  confirmedMeasurements: [{ label, value, unit: cm|inch|ft|mm }]
}

// shared
status: "new" | "confirmed" | "measurement_scheduled" | "measurement_done"
        | "in_production" | "ready" | "delivered" | "cancelled"
statusHistory: [{ status, changedAt, note }]  // auto-managed by pre-save hook
activityLog:   [{ message, createdAt }]        // manual + echoed status changes
agreedPrice: Number | null
internalNotes: String  // admin-only, stripped from customer-facing responses
orderCode: "LKU-2026-0042"  // unique index
```

The pre-save hook on Order:
- Detects status changes
- Appends to `statusHistory` with the transient `_statusNote` field as the note
- Echoes the change to `activityLog` as a human-readable message
- Clears `_statusNote`

---

## Key design decisions

**Why custom session auth instead of NextAuth?**
Simpler for a single-admin app. No OAuth needed. Token is a 32-byte random hex string;
only the SHA-256 hash is stored in MongoDB; raw token lives in an httpOnly cookie.

**Why client-side filtering on admin dashboard?**
The order volume for a small workshop fits easily in memory. Fetching all orders once
enables instant search + stats bar without extra round trips.

**Why MongoDB transactions only for ready_made orders?**
Custom orders don't touch stock, so there's nothing to roll back. Transactions require
a replica set (Atlas provides this; local dev with single mongod does not — use
`mongod --replSet rs0` or Atlas for testing transactions locally).

**Why in-memory rate limiting instead of Redis?**
Low traffic. Redis adds cost and complexity. The Map-based limiter resets on cold start,
which is acceptable for a small business. Not suitable for high-traffic production.

**Why compress images client-side before upload?**
Vercel serverless functions have a 4.5MB request body limit. Phone photos are 5–10MB.
Canvas API compresses to JPEG at 82% quality / 1200px max width → typically under 500KB.

**Email — current state (free Resend plan):**
Resend restricts sends to `iamabiral007@gmail.com` only (the account owner) without a
verified domain. Currently only `sendNewOrderNotification` is useful (admin alert on new
order). `sendStatusUpdateEmail` is wired up but will fail for customer emails until a
domain is verified at resend.com/domains and `FROM_EMAIL` is updated.

---

## Animation system

All animations are pure CSS, no libraries.

- `FadeIn` component (`components/FadeIn.jsx`) — wraps any element, applies scroll-triggered class
- `useInView` hook (`hooks/useInView.js`) — Intersection Observer, fires once
- CSS classes in `globals.css`: `fade-up`, `fade-in`, `fade-left`, `fade-right` → gain `in-view` class
- `delay-100` through `delay-600` for stagger
- `marquee-track` — continuous horizontal scroll (GrainBand)
- `wa-ring` — pulse animation on WhatsApp button
- `hero-line` — staggered text reveal on Hero mount
- `line-fill` — width animation for Process connector line
- All animations respect `prefers-reduced-motion`

---

## How to run locally

```bash
npm install
# copy .env.local and fill in values (MONGODB_URI, CLOUDINARY_*, etc.)
npm run dev
```

Local MongoDB: `mongodb://localhost:27017/lovely-kastha-udhog`
For transactions (ready_made orders), run as replica set:
```bash
mongod --replSet rs0 --dbpath /data/db
# then in mongosh:
rs.initiate()
```

---

## Admin access

1. Go to `/admin/signup`, enter `ADMIN_SIGNUP_SECRET` value
2. Creates an admin account
3. Login at `/admin/login`
4. Dashboard at `/admin/dashboard`

Only one admin account is needed. The signup route stays open but requires the secret.

---

## Vercel deployment notes

- `MONGODB_URI` must include the database name: `.../lovely-kastha-udhog?...`
- Special characters in MongoDB password must be URL-encoded (e.g. `@` → `%40`)
- Atlas Network Access → allow `0.0.0.0/0` (Vercel has dynamic IPs)
- After adding env vars, always redeploy for them to take effect
- Build errors showing MongoDB auth failures during static page generation are harmless —
  the pages fall back to empty data and serve correctly at runtime

---

## Craftsman portrait section

`components/CraftsmanPortrait.jsx` — replace the `PHOTO_URL` constant with a real photo
of Arpan at the workbench. Best specs: landscape or portrait orientation, 1400px+ wide,
good natural lighting. Upload to Cloudinary admin panel and paste the URL.
Also update the name and about paragraph to match the real bio.
