"use client";

import { useEffect, useRef } from "react";
import {
  sectionCardClassName,
  sectionPanelClassName,
} from "@/src/app/components/section-card-styles";
import { sectionRhythm } from "@/src/app/components/layout/page-rhythm";

type SectionShellProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  density?: keyof typeof sectionRhythm;
};

export const sectionShellClassName = sectionPanelClassName;

export const sectionGlowClassName =
  "pointer-events-none absolute inset-0";

export const sectionInnerCardClassNames = {
  comfortable: `${sectionCardClassName} ${sectionRhythm.comfortable.inner}`,
  compact: `${sectionCardClassName} ${sectionRhythm.compact.inner}`,
} as const;

export const sectionInnerCardClassName = sectionInnerCardClassNames.comfortable;

export function SectionShell({
  children,
  className,
  contentClassName = "relative",
  density = "comfortable",
}: Readonly<SectionShellProps>) {
  const shellRef = useRef<HTMLElement | null>(null);
  const heightClass = density === "comfortable" ? "min-h-screen min-h-[calc(var(--vh,1vh)*100)]" : "";
  const shellClassName = `${sectionShellClassName} ${heightClass} ${sectionRhythm[density].shell}`;

  useEffect(() => {
    const el = shellRef.current;

    if (!el || typeof window === "undefined") {
      return;
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let pointerId = -1;
    let startY = 0;
    let dragging = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0) {
        // allow touch scroll and non-left clicks
        return;
      }

      pointerId = (event as any).pointerId ?? -1;
      startY = event.clientY;
      dragging = true;

      try {
        (event.target as Element)?.setPointerCapture?.(pointerId);
      } catch (err) {
        // ignore
      }

      el.style.transition = "";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || (event as any).pointerId !== pointerId) return;

      const delta = event.clientY - startY;
      el.style.transform = `translateY(${delta}px)`;
      el.style.willChange = "transform";
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!dragging || (event as any).pointerId !== pointerId) return;

      dragging = false;

      try {
        (event.target as Element)?.releasePointerCapture?.(pointerId);
      } catch (err) {
        // ignore
      }

      el.style.transition = "transform 360ms cubic-bezier(.2,.9,.3,1)";
      el.style.transform = "";

      setTimeout(() => {
        el.style.transition = "";
        el.style.willChange = "";
      }, 380);
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <article ref={shellRef} className={className ? `${shellClassName} ${className}` : shellClassName}>
      <div className={sectionGlowClassName} />
      <div className={contentClassName}>{children}</div>
    </article>
  );
}
