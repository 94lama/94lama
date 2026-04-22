"use client";

import { animate, remove } from "animejs";
import { useEffect } from "react";

const hoverSelector = ".motion-image, .motion-control, .motion-surface";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolveHoverTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLElement>(hoverSelector);
}

function containsRelatedTarget(element: HTMLElement, relatedTarget: EventTarget | null) {
  return relatedTarget instanceof Node && element.contains(relatedTarget);
}

function animateHover(element: HTMLElement, entering: boolean) {
  remove(element);

  if (element.classList.contains("motion-image")) {
    animate(element, {
      scale: entering ? 1.03 : 1,
      duration: entering ? 520 : 340,
      ease: entering ? "outCubic" : "outQuad",
    });

    return;
  }

  if (element.classList.contains("motion-control")) {
    animate(element, {
      translateY: entering ? -4 : 0,
      scale: entering ? 1.01 : 1,
      duration: entering ? 280 : 220,
      ease: entering ? "outQuad" : "outQuad",
    });

    return;
  }

  animate(element, {
    translateY: entering ? -6 : 0,
    scale: entering ? 1.006 : 1,
    duration: entering ? 360 : 280,
    ease: entering ? "outCubic" : "outQuad",
  });
}

export function MotionController() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const target = resolveHoverTarget(event.target);

      if (!target || containsRelatedTarget(target, event.relatedTarget)) {
        return;
      }

      animateHover(target, true);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const target = resolveHoverTarget(event.target);

      if (!target || containsRelatedTarget(target, event.relatedTarget)) {
        return;
      }

      animateHover(target, false);
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = resolveHoverTarget(event.target);

      if (!target) {
        return;
      }

      animateHover(target, true);
    };

    const onFocusOut = (event: FocusEvent) => {
      const target = resolveHoverTarget(event.target);

      if (!target || containsRelatedTarget(target, event.relatedTarget)) {
        return;
      }

      animateHover(target, false);
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return null;
}
