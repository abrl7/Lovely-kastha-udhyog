"use client";

import { useInView } from "@/hooks/useInView";

// Wraps children with a scroll-triggered animation.
// direction: "up" | "in" | "left" | "right"
// delay: tailwind delay class e.g. "delay-200"
// className: extra classes on the wrapper div
export default function FadeIn({
  children,
  direction = "up",
  delay = "",
  className = "",
  as: Tag = "div",
  threshold = 0.15,
}) {
  const { ref, inView } = useInView({ threshold });
  const animClass = `fade-${direction}`;

  return (
    <Tag
      ref={ref}
      className={`${animClass} ${inView ? "in-view" : ""} ${delay} ${className}`}
    >
      {children}
    </Tag>
  );
}
