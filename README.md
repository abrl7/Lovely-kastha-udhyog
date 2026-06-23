# Lovely Kastha Udhog — Website

Next.js (App Router) + Tailwind CSS port of the original single-page design.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  layout.js       — fonts (Fraunces + Work Sans), global metadata
  page.js          — assembles all sections
  globals.css      — Tailwind directives + the few styles utilities can't express
components/
  Header.jsx       — fixed nav
  Hero.jsx         — full-bleed hero
  GrainBand.jsx     — wood-grain divider (signature element)
  Categories.jsx   — horizontal scroll-snap category strip
  Featured.jsx     — asymmetric featured product grid
  Story.jsx        — craftsmanship / family story section
  Process.jsx      — 4-step process
  Inquiry.jsx       — contact info + form wrapper (server component)
  InquiryForm.jsx  — the actual form ("use client", has onSubmit)
  Footer.jsx
```

## Before going live

- Replace placeholder text in brackets: `[Phone]`, `[Email]`, `[Address]`,
  `[Your dad's workshop address here]` — in `Inquiry.jsx` and `Footer.jsx`.
- Swap Unsplash stock photo URLs for real product/workshop photos. Search
  for `images.unsplash.com` across `components/` to find every instance.
  Once you have local images, drop them in `public/images/` and use
  `<Image src="/images/your-photo.jpg" ... />` instead of a remote URL.
- Wire up `InquiryForm.jsx` — it currently just shows an alert on submit.
  Options: a simple API route (`app/api/inquiry/route.js`) that emails you,
  or a service like Formspree/Resend.
- Verify wood species named (sheesham, teak, sal, mango) match what your
  dad's workshop actually uses — these are placeholders.
- Add real social links in `Footer.jsx` (currently `#`).

## Notes

This was built in a sandboxed environment without internet access, so
`npm install` / `next build` could not be run here to verify compilation.
The code was written and manually reviewed against React/Next.js/Tailwind
syntax, but run `npm run build` locally before deploying to catch anything
a live compiler would flag.
