"use client";

import { useCallback, useState } from "react";

import type { ContactInfo } from "@/src/content/portfolio/types";
import {
  inlineAllComputedStyles,
  removeDocumentStyles,
  replaceInlineSvgWithImages,
  resolveSafeStyleValue,
  sanitizeUnsupportedColorStyles,
  stripDragChrome,
  stripPdfBorders,
} from "@/src/app/components/hero-download-card-dom";

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>;
  contact?: ContactInfo;
};

function addContactLinks(
  pdf: import("jspdf").jsPDF,
  section: HTMLElement,
  contact: ContactInfo,
  scale: number,
  pdfW: number,
  pdfH: number,
  dw: number,
  dh: number,
) {
  const sectionRect = section.getBoundingClientRect();
  const buttons = section.querySelectorAll(
    '[data-draggable-id="hero-contact-line"] a[aria-label]',
  );
  const urlMap: Record<string, string> = {
    Email: contact.email ? `mailto:${contact.email}` : "",
    Phone: contact.phone ? `tel:${contact.phone.replace(/\s+/g, "")}` : "",
    GitHub: contact.github || "",
    LinkedIn: contact.linkedin || "",
  };

  buttons.forEach((button) => {
    const label = (button as HTMLElement).getAttribute("aria-label") || "";
    const url = urlMap[label];
    if (!url) return;

    const rect = button.getBoundingClientRect();
    const x = rect.left - sectionRect.left;
    const y = rect.top - sectionRect.top;

    pdf.link(
      (pdfW - dw) / 2 + x * scale,
      (pdfH - dh) / 2 + y * scale,
      rect.width * scale,
      rect.height * scale,
      { url },
    );
  });
}

export function HeroDownloadCard({ sectionRef, contact }: Readonly<Props>) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const section = sectionRef.current;
    if (!section || loading) return;

    setLoading(true);

    try {
      const { default: html2canvas } = await import("html2canvas");
      const width = section.scrollWidth || 1200;
      const height = section.scrollHeight || 800;
      const pageBg = resolveSafeStyleValue(
        document,
        "background-color",
        getComputedStyle(document.documentElement).backgroundColor,
        "#ffffff",
      );

      const canvas = await html2canvas(section, {
        width,
        height,
        backgroundColor: pageBg,
        scale: 1,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        logging: false,
        onclone: (clonedDoc, clonedSection) => {
          stripDragChrome(clonedSection);
          inlineAllComputedStyles(clonedSection);
          replaceInlineSvgWithImages(clonedSection);
          removeDocumentStyles(clonedDoc);
          sanitizeUnsupportedColorStyles(clonedSection);
          stripPdfBorders(clonedSection);
        },
      });

      const { jsPDF } = await import("jspdf");
      const pdfW = 85;
      const pdfH = 55;
      const scale = Math.min(pdfW / canvas.width, pdfH / canvas.height);
      const dw = canvas.width * scale;
      const dh = canvas.height * scale;
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfW, pdfH],
      });

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        (pdfW - dw) / 2,
        (pdfH - dh) / 2,
        dw,
        dh,
      );

      if (contact) {
        addContactLinks(pdf, section, contact, scale, pdfW, pdfH, dw, dh);
      }

      pdf.save("riccardo-la-malfa-card.pdf");
    } catch (err) {
      console.error("[HeroDownloadCard]", err);
      alert("Could not generate PDF. Try again.");
    } finally {
      setLoading(false);
    }
  }, [sectionRef, contact, loading]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      aria-label="Download hero snapshot PDF"
      title="Download hero snapshot (85×55mm)"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-slate-600 backdrop-blur-sm transition-[background-color,color,box-shadow] duration-200 ease-out will-change-transform motion-control hover:bg-white hover:text-slate-900 hover:shadow-md disabled:opacity-50 dark:border-white/12 dark:bg-white/6 dark:text-white/62 dark:hover:bg-white/12 dark:hover:text-white"
    >
      {loading ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
    </button>
  );
}
