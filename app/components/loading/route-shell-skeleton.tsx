"use client";

import { animate, remove } from "@/src/app/lib/animation";
import { useLayoutEffect, useRef } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createExitGhost(node: HTMLElement) {
  const exitDuration = 1000;
  const fadeDuration = 280;
  const holdDuration = exitDuration - fadeDuration;
  const startOpacity = Number.parseFloat(window.getComputedStyle(node).opacity) || 1;

  document.querySelectorAll<HTMLElement>('[data-route-shell-ghost="true"]').forEach((ghost) => {
    ghost.remove();
  });

  const ghost = node.cloneNode(true) as HTMLElement;
  ghost.dataset.routeShellGhost = "true";
  ghost.classList.remove("route-shell-fade");
  ghost.style.position = "fixed";
  ghost.style.inset = "0";
  ghost.style.zIndex = "70";
  ghost.style.pointerEvents = "none";
  ghost.style.margin = "0";
  ghost.style.animation = "none";
  ghost.style.opacity = String(startOpacity);
  ghost.style.transform = "none";
  ghost.setAttribute("aria-hidden", "true");

  document.body.appendChild(ghost);

  animate(ghost, {
    opacity: [startOpacity, 0],
    delay: holdDuration,
    duration: fadeDuration,
    ease: "outQuad",
    onComplete: () => {
      ghost.remove();
    },
  });
}

export function EclipseLoader() {
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const moonRef = useRef<HTMLDivElement | null>(null);
  const moonSurfaceRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const sphere = sphereRef.current;
    const moon = moonRef.current;
    const moonSurface = moonSurfaceRef.current;
    const reducedMotion = prefersReducedMotion();

    if (!sphere || !moon || !moonSurface) {
      return;
    }

    const sphereSize = sphere.getBoundingClientRect().width;
    const travel = sphereSize * 0.22;

    remove(moon);
    remove(moonSurface);

    if (reducedMotion) {
      return () => {
        remove(moon);
        remove(moonSurface);
      };
    }

    animate(moon, {
      translateX: [-travel, travel],
      translateZ: [-18, 26],
      rotateY: [30, -30],
      rotateX: [-10, 10],
      scale: [0.97, 1.02],
      duration: 2200,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    animate(moonSurface, {
      translateX: [14, -12],
      translateY: [-4, 6],
      opacity: [0.38, 0.72],
      scale: [0.94, 1.03],
      duration: 2200,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    return () => {
      remove(moon);
      remove(moonSurface);
    };
  }, []);

  return (
    <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52" style={{ perspective: "1200px" }}>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(249,250,251,0.88)_0%,rgba(125,174,255,0.72)_34%,rgba(59,130,246,0.28)_54%,rgba(2,6,23,0)_74%)] shadow-[0_0_55px_rgba(96,165,250,0.4)]" />
      <div
        ref={sphereRef}
        className="relative h-[68%] w-[68%] overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_32%_32%,rgba(255,255,255,0.92),rgba(186,230,253,0.78)_28%,rgba(59,130,246,0.32)_58%,rgba(2,6,23,0.04)_76%)] shadow-[inset_-18px_-24px_36px_rgba(2,6,23,0.18)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={moonRef}
          className="absolute left-[3%] top-[3%] h-[94%] w-[94%] overflow-hidden rounded-full border border-white/6 bg-[radial-gradient(circle_at_30%_28%,rgba(51,65,85,0.82)_0%,rgba(7,10,18,0.96)_48%,rgba(0,0,0,1)_100%)] shadow-[inset_12px_10px_18px_rgba(71,85,105,0.14),inset_-18px_-20px_30px_rgba(0,0,0,0.92),0_0_18px_rgba(2,6,23,0.9)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            ref={moonSurfaceRef}
            className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_26%_24%,rgba(148,163,184,0.22),transparent_38%),radial-gradient(circle_at_74%_78%,rgba(0,0,0,0.72),transparent_52%)] opacity-70"
          />
        </div>
        <div className="absolute inset-0 rounded-full border border-white/8" />
      </div>
    </div>
  );
}

export function RouteShellSkeleton() {
  const shellRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;

    if (!shell || prefersReducedMotion()) {
      return;
    }

    return () => {
      createExitGhost(shell);
      remove(shell);
    };
  }, []);

  return (
    <main
      ref={shellRef}
      className="route-shell-fade grid min-h-screen place-items-center overflow-hidden bg-[#02040a]"
      data-route-shell="portfolio-loading"
    >
      <EclipseLoader />

      {/* Hero loading shell */}
      {/* Interactive section loading shell */}
      {/* Lower content grids loading shell */}
    </main>
  );
}
