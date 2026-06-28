import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lovelykasthaUdhog.com";
const SITE_NAME = "Lovely Kastha Udhog";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Handcrafted Wood Furniture`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Solid wood furniture, hand-built by a family workshop in Nepal. Living room, bedroom, dining, office, and fully custom pieces.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_NP",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="font-sans">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
