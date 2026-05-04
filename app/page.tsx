"use client";

import { useEffect } from "react";

export default function RootRedirectPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Replace so the back button doesn't return to '/'
      window.location.replace("/en");
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <p>Redirecting to <a href="/en">/en</a>…</p>
    </div>
  );
}
