"use client";

import Image from "next/image";
import { useInView } from "@/hooks/useInView";

// ─── HOW TO ADD YOUR DAD'S REAL PHOTO ──────────────────────────────────────
// 1. Go to cloudinary.com → Media Library → Upload
// 2. Upload the photo (landscape or portrait, 1400px+ wide, good lighting)
// 3. Copy the URL (click the image → "Copy URL")
// 4. Replace the value of PHOTO_URL below with that URL
// ───────────────────────────────────────────────────────────────────────────
const PHOTO_URL =
  "https://scontent.fpkr1-1.fna.fbcdn.net/v/t1.6435-9/103132522_2847059282082505_7897278179155157914_n.jpg?stp=dst-jpg_tt6&cstp=mx960x720&ctp=s960x720&_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGD6Y7t7-fP-ZHXW7BPOUC2FXh1HWie4_gVeHUdaJ7j-EmEO5TytVRYCqTeoFCaEmFGsOKcJvd5P_uts_319pE8&_nc_ohc=ghvcGPKbryYQ7kNvwEcuQZ_&_nc_oc=Ado7p0qLP9761QYC-39VW75T86rO_o4dbGBLUItz86TFaCtdwRFITbElYPXyqti_MAl9D6LdNTjzVCiBeFE2lMH2&_nc_zt=23&_nc_ht=scontent.fpkr1-1.fna&_nc_gid=-z4-JJjBhOd-7lsC30540w&_nc_ss=7b2a8&oh=00_AQBfu_fumW1av2JwJJMEqc8OFdIL0GsoWaUVHA_9l4TJ5Q&oe=6A892807";

// NOTE: The current URL is from Facebook CDN which caps at 960×720.
// For best quality, upload the photo to Cloudinary and replace PHOTO_URL.

export default function CraftsmanPortrait() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex items-end overflow-hidden"
    >
      {/* Background photo via Next.js Image for proper optimization */}
      <div className="absolute inset-0">
        <Image
          src={PHOTO_URL}
          alt="Arpan Shrestha — Master Craftsman at work"
          fill
          quality={95}
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.55]"
        />
      </div>

      {/* Dark gradient — heavier at bottom so text pops */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 z-[1]" />

      {/* Side vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-[1]" />

      <div className="relative z-10 px-[6vw] py-[6rem] max-w-[800px]">
        {/* Quote mark */}
        <div className={`font-serif text-[6rem] text-brass/30 leading-none mb-[-1.5rem] fade-up ${inView ? "in-view" : ""}`}>
          &ldquo;
        </div>

        {/* Quote */}
        <blockquote className={`font-serif font-light text-cream-soft text-[clamp(1.5rem,3.2vw,2.4rem)] leading-snug mb-8 fade-up delay-100 ${inView ? "in-view" : ""}`}>
          I don&apos;t make furniture. I make something that will still be
          in your family thirty years from now.
        </blockquote>

        {/* Divider */}
        <div className={`w-16 h-px bg-brass mb-7 fade-up delay-200 ${inView ? "in-view" : ""}`} />

        {/* Name & role */}
        <div className={`fade-up delay-300 ${inView ? "in-view" : ""}`}>
          <p className="font-serif text-[1.4rem] text-cream-soft font-medium">
            Arpan Shrestha
          </p>
          <p className="text-[0.78rem] font-semibold tracking-[0.14em] uppercase text-brass mt-1">
            Master Craftsman · Lovely Kastha Udhog
          </p>
        </div>

        {/* About paragraph */}
        <p className={`text-cream-soft/70 text-[0.95rem] max-w-[540px] mt-6 leading-relaxed fade-up delay-400 ${inView ? "in-view" : ""}`}>
          With over 25 years behind the workbench, he learned the craft from
          his father and has since trained a new generation of woodworkers in
          the same tradition — choosing every plank by hand, cutting every
          joint with care, and refusing to rush what takes time to do right.
        </p>

        {/* Mini stats */}
        <div className={`flex flex-wrap gap-8 mt-8 fade-up delay-500 ${inView ? "in-view" : ""}`}>
          {[
            ["25+", "Years of craft"],
            ["1,200+", "Pieces built"],
            ["3rd", "Generation"],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="font-serif text-2xl text-brass font-semibold">{num}</p>
              <p className="text-[0.75rem] text-cream-soft/55 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
