"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 300, damping: 25 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 25 });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    setIsVisible(true);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    document.addEventListener("mousemove", move);

    // Track hover on clickable / interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, [role="button"], input, select, textarea, label, .card-hover, [data-cursor="pointer"]'
    );
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ left: springX, top: springY }}
      >
        <motion.div
          animate={{
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
            borderColor: isHovering
              ? "rgba(99, 102, 241, 0.5)"
              : "rgba(99, 102, 241, 0.25)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="rounded-full border border-indigo-500/25"
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ left: cursorX, top: cursorY }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 0.5 : 1,
            backgroundColor: isHovering
              ? "rgba(99, 102, 241, 0.8)"
              : "rgba(99, 102, 241, 0.4)",
          }}
          transition={{ duration: 0.15 }}
          className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"
        />
      </motion.div>
    </>
  );
}
