"use client";

import { useEffect, useRef, useState } from "react";
import { useDragResizePointer } from "./drag-resize-pointer";
import { injectDragResizeStyles, getStorageKey, absolutizeDelegateItems, centerDelegateItems } from "./drag-resize-helpers";

export type DragResizeState = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type DragResizeProps = {
  id?: string;
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  aspectLock?: boolean;
  onChange?: (s: DragResizeState) => void;
  onEnd?: (s: DragResizeState) => void;
  className?: string;
  style?: React.CSSProperties;
  delegate?: boolean;
  delegateSelector?: string;
};

const STORAGE_VERSION = 1;

export default function DragResize({
  id, children, minWidth = 160, minHeight = 120,
  initialX = 0, initialY = 0, initialWidth, initialHeight,
  aspectLock = false, onChange, onEnd, className, style,
  delegate = false, delegateSelector,
  absoluteDelegate = false, absoluteCenter = false,
}: DragResizeProps & { absoluteDelegate?: boolean; absoluteCenter?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const operationRef = useRef<"drag" | "resize" | null>(null);
  const startRef = useRef({ x: 0, y: 0, w: 0, h: 0, tx: 0, ty: 0 });
  const rafRef = useRef<number | null>(null);
  const draggableElRef = useRef<HTMLElement | null>(null);
  const resizeSideRef = useRef<"br" | "bl" | null>(null);

  const [state, setState] = useState<DragResizeState>({
    x: initialX, y: initialY, width: initialWidth, height: initialHeight,
  });

  // CSS injection (idempotent, runs once)
  useEffect(() => { injectDragResizeStyles(); }, []);

  // If requested, convert delegate children to absolute position preserving layout
  useEffect(() => {
    if (absoluteCenter && delegate && delegateSelector && wrapperRef.current) {
      requestAnimationFrame(() => {
        // center relative to nearest <section> to ensure exact section center
        const sectionEl = wrapperRef.current!.closest("section") as HTMLElement | null;
        const container = sectionEl ?? wrapperRef.current!;
        centerDelegateItems(container, delegateSelector);
      });
    } else if (absoluteDelegate && delegate && delegateSelector && contentRef.current) {
      // run after paint
      requestAnimationFrame(() => {
        absolutizeDelegateItems(contentRef.current!, delegateSelector);
      });
    }
  }, [absoluteCenter, absoluteDelegate, delegate, delegateSelector]);

  // load persisted wrapper state
  useEffect(() => {
    const key = getStorageKey(id);
    if (!key) return;
    try {
      if (delegate) {
        try { localStorage.removeItem(key); } catch {}
      } else {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.version === STORAGE_VERSION && typeof parsed.x === "number") {
            setState({ x: parsed.x, y: parsed.y, width: parsed.width, height: parsed.height });
            return;
          }
        }
      }
    } catch { /* ignore */ }
    if (contentRef.current && !delegate) {
      const rect = contentRef.current.getBoundingClientRect();
      setState((s) => ({
        x: s.x, y: s.y,
        width: s.width ?? rect.width,
        height: s.height ?? rect.height,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reflect style changes
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.transform = `translate(${state.x}px, ${state.y}px)`;
    el.style.touchAction = "none";
    if (contentRef.current) {
      if (state.width !== undefined) contentRef.current.style.width = state.width + "px";
      if (state.height !== undefined) contentRef.current.style.height = state.height + "px";
    }
  }, [state.x, state.y, state.width, state.height]);

  // pointer events hook
  useDragResizePointer({
    wrapperRef, contentRef, pointerIdRef, operationRef, startRef, rafRef,
    draggableElRef, resizeSideRef, state, setState,
    minWidth, minHeight, aspectLock, id, delegate, delegateSelector,
    onChange, onEnd,
  });

  // keyboard move
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onKeyDown = (ev: KeyboardEvent) => {
      if (!ev.key.startsWith("Arrow")) return;
      ev.preventDefault();
      const step = ev.shiftKey ? 10 : 1;
      let nx = state.x, ny = state.y;
      if (ev.key === "ArrowUp") ny -= step;
      else if (ev.key === "ArrowDown") ny += step;
      else if (ev.key === "ArrowLeft") nx -= step;
      else if (ev.key === "ArrowRight") nx += step;
      setState((s) => ({ ...s, x: nx, y: ny }));
      onChange?.({ x: nx, y: ny, width: state.width, height: state.height });
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [state.x, state.y, onChange, state.width, state.height]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: "relative", display: "block", ...style }}
      tabIndex={0}
      aria-label="Draggable resizable region"
    >
      <div
        ref={contentRef}
        style={{
          width: state.width !== undefined ? `${state.width}px` : undefined,
          height: state.height !== undefined ? `${state.height}px` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
