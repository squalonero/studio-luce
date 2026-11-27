"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealTag = "div" | "aside" | "figure" | "header" | "h1" | "li";

type RevealProps = {
  as?: RevealTag;
  className?: string;
  children: ReactNode;
  /** Wait before the fade starts, so neighbours can arrive in sequence. */
  delay?: number;
  /**
   * rise: text lifts into place.
   * side: a column enters from the left.
   * photo: a photograph enters from the right.
   * fade: opacity only, for a line that should not travel.
   */
  variant?: "rise" | "side" | "photo" | "fade";
  id?: string;
  labelledBy?: string;
};

/**
 * Fades its content in once, the first time it enters the viewport.
 * The motion is skipped when the visitor asks for reduced motion.
 */
export function Reveal({
  as = "div",
  className,
  children,
  delay = 0,
  variant = "rise",
  id,
  labelledBy,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <Tag
      ref={ref}
      id={id}
      className={["reveal", `reveal-${variant}`, shown ? "is-in" : "", className].filter(Boolean).join(" ")}
      style={style}
      aria-labelledby={labelledBy}
    >
      {children}
    </Tag>
  );
}
