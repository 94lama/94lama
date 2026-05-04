"use client";

import { animate, remove } from "@/app/lib/animation";
import { useEffect, useRef, useState } from "react";

import { SectionHeading } from "@/app/components/section-heading";
import { SectionShell } from "@/app/components/section-shell";
import {
  sectionBodyToneClassName,
  sectionCardClassName,
  sectionControlMotionClassName,
  sectionEyebrowToneClassName,
  sectionPrimaryActionClassName,
  sectionTitleToneClassName,
} from "@/app/components/section-card-styles";
import type { CertificateEntry } from "@/src/content/portfolio/types";

type CertificatesSectionProps = {
  certificates: CertificateEntry[];
};

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CertificatesSection({ certificates }: Readonly<CertificatesSectionProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const reducedMotion = prefersReducedMotion();
    const overlay = overlayRef.current;
    const card = cardRef.current;
    const trigger = triggerRef.current;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    if (overlay && card && !reducedMotion) {
      remove(overlay);
      remove(card);

      animate(overlay, {
        opacity: [0, 1],
        duration: 240,
        ease: "outQuad",
      });

      animate(card, {
        opacity: [0, 1],
        translateY: [34, 0],
        rotateX: [12, 0],
        rotateY: [-8, 0],
        scale: [0.965, 1],
        duration: 520,
        ease: "outCubic",
      });
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = cardRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion || !cardRef.current) {
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

      animate(cardRef.current, {
        rotateY: offsetX * 8,
        rotateX: offsetY * -8,
        duration: 220,
        ease: "outQuad",
      });
    };

    const onPointerLeave = () => {
      if (reducedMotion || !cardRef.current) {
        return;
      }

      animate(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 280,
        ease: "outQuad",
      });
    };

    document.addEventListener("keydown", onKeyDown);
    card?.addEventListener("pointermove", onPointerMove);
    card?.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      card?.removeEventListener("pointermove", onPointerMove);
      card?.removeEventListener("pointerleave", onPointerLeave);

      if (overlay) {
        remove(overlay);
      }

      if (card) {
        remove(card);
      }

      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <SectionShell density="compact">
        <SectionHeading
          index="04"
          title="Certificates"
          description="Open the complete certification archive in a dedicated detail layer."
        />
        <div className="mt-6 sm:mt-7">
          <div className={`${sectionCardClassName} space-y-5 px-5 py-5 sm:px-6 sm:py-6`}>
            <div className="space-y-2">
              <p
                className={`font-mono text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}
              >
                Verified learning track
              </p>
              <p className={`text-base leading-7 ${sectionBodyToneClassName}`}>
                Browse the full list of certifications across frontend, cloud, Linux,
                cybersecurity, and delivery workflows.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className={`text-sm ${sectionBodyToneClassName}`}>
                {certificates.length} certificates available.
              </p>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen(true)}
                className={sectionPrimaryActionClassName}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls="certificates-modal"
              >
                View all certificates
              </button>
            </div>
          </div>
        </div>
      </SectionShell>

      {isOpen ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <div
            ref={cardRef}
            id="certificates-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificates-modal-title"
            className={`${sectionCardClassName} motion-surface relative max-h-[min(88vh,52rem)] w-full max-w-3xl overflow-hidden border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,249,0.92))] shadow-[0_40px_120px_-44px_rgba(15,23,42,0.72)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.94))] dark:shadow-[0_38px_120px_-48px_rgba(15,23,42,0.94)]`}
            style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
            onClick={(event) => event.stopPropagation()}
          >

            <div className="relative flex max-h-[min(88vh,52rem)] flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-black/8 px-5 py-5 dark:border-white/8 sm:px-7 sm:py-6">
                <div className="space-y-2">
                  <p
                    className={`font-mono text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}
                  >
                    Full certification archive
                  </p>
                  <h2
                    id="certificates-modal-title"
                    className={`text-2xl font-semibold tracking-tight sm:text-[2rem] ${sectionTitleToneClassName}`}
                  >
                    Certifications and specialist programs
                  </h2>
                  <p className={`max-w-2xl text-sm leading-7 sm:text-base ${sectionBodyToneClassName}`}>
                    A complete recruiter-facing list of certifications currently surfaced in the
                    portfolio content.
                  </p>
                </div>

                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`min-h-11 min-w-11 rounded-full border border-black/10 bg-white/78 px-4 py-3 text-sm font-semibold ${sectionControlMotionClassName} ${sectionTitleToneClassName} dark:border-white/10 dark:bg-white/8`}
                  aria-label="Close certificates modal"
                >
                  Close
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {certificates.map((certificate, index) => (
                    <article
                      key={`${certificate.title}-${certificate.issuer ?? "issuer"}-${index}`}
                      className={`${sectionCardClassName} bg-white/84 px-4 py-4 [transform:translateZ(24px)] dark:bg-white/6`}
                    >
                      <div className="space-y-2">
                        <p
                          className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}
                        >
                          {certificate.issuer ?? "Certificate"}
                        </p>
                        <h3 className={`text-lg font-semibold leading-6 ${sectionTitleToneClassName}`}>
                          {certificate.title}
                        </h3>
                        {certificate.year ? (
                          <p className={`text-sm ${sectionBodyToneClassName}`}>{certificate.year}</p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
