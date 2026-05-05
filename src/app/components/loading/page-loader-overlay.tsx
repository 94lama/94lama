"use client";

import { animate, remove } from "@/lib/animation";
import { useLayoutEffect, useRef } from "react";

import { EclipseLoader } from "@/components/loading/route-shell-skeleton";

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PageLoaderOverlay() {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;

    if (!overlay) {
      return;
    }

    const reducedMotion = prefersReducedMotion();

    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        overlay.remove();
      }, 1000);

      return () => {
        window.clearTimeout(timer);
      };
    }

    remove(overlay);

    animate(overlay, {
      opacity: [1, 1, 0],
      duration: 1000,
      times: [0, 0.72, 1],
      ease: "linear",
      onComplete: () => {
        overlay.remove();
      },
    });

    return () => {
      remove(overlay);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-65 grid place-items-center overflow-hidden bg-[#02040a]"
      aria-hidden="true"
    >
      <EclipseLoader />
    </div>
  );
}
