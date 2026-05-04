"use client";

import { useEffect } from "react";

export function VhFixer() {
  useEffect(() => {
    function setVh() {
      // Set CSS custom property to handle mobile browser UI chrome resizing
      document.documentElement.style.setProperty("--vh", `${window.innerHeight / 100}px`);
    }

    setVh();
    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
  }, []);

  return null;
}
