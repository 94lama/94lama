import { useEffect } from "react";
import type { DragResizeState } from "./drag-resize.client";
import {
  createDelegateHandles, findCandidate, parseTransform,
  persistDelegated, persistWrapper,
} from "./drag-resize-helpers";
import { animateResizeEnd } from "./drag-resize-animation";

export function useDragResizePointer(p: {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  pointerIdRef: React.MutableRefObject<number | null>;
  operationRef: React.MutableRefObject<"drag" | "resize" | null>;
  startRef: React.MutableRefObject<{ x: number; y: number; w: number; h: number; tx: number; ty: number }>;
  rafRef: React.MutableRefObject<number | null>;
  draggableElRef: React.MutableRefObject<HTMLElement | null>;
  resizeSideRef: React.MutableRefObject<"br" | "bl" | null>;
  state: DragResizeState;
  setState: React.Dispatch<React.SetStateAction<DragResizeState>>;
  minWidth: number; minHeight: number; aspectLock: boolean;
  id?: string; delegate: boolean; delegateSelector?: string;
  onChange?: (s: DragResizeState) => void;
  onEnd?: (s: DragResizeState) => void;
}) {
  const { wrapperRef, contentRef, pointerIdRef, operationRef, startRef, rafRef,
    draggableElRef, resizeSideRef, state, setState, minWidth, minHeight,
    aspectLock, id, delegate, delegateSelector, onChange, onEnd } = p;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
    let isPointerDragging = false, thresholdExceeded = false;
    let observer: MutationObserver | null = null;
    if (delegate && delegateSelector && contentRef.current) {
      observer = createDelegateHandles(contentRef.current, delegateSelector);
    }

    const onPointerDown = (ev: PointerEvent) => {
      if (ev.button && ev.button !== 0) return;
      const dResize = (ev.target as HTMLElement).closest("[data-delegate-resize-handle]") as HTMLElement | null;
      const rect = contentRef.current?.getBoundingClientRect();
      pointerIdRef.current = ev.pointerId;
      startRef.current = { x: ev.clientX, y: ev.clientY,
        w: rect?.width ?? state.width ?? 0, h: rect?.height ?? state.height ?? 0, tx: 0, ty: 0 };

      // explicit delegate resize handle (bottom-right)
      if (dResize && delegate && delegateSelector) {
        const c = dResize.closest(delegateSelector) as HTMLElement | null;
        if (c) {
          operationRef.current = "resize"; resizeSideRef.current = "br";
          draggableElRef.current = c;
          const cr = c.getBoundingClientRect();
          startRef.current.w = cr.width; startRef.current.h = cr.height;
          const { tx, ty } = parseTransform(c);
          startRef.current.tx = tx; startRef.current.ty = ty;
          isPointerDragging = true; thresholdExceeded = true;
          try { (dResize as Element).setPointerCapture(ev.pointerId); } catch {}
          ev.preventDefault(); return;
        }
      }

      // delegated drag
      if (!dResize && delegate && contentRef.current) {
        const c = findCandidate(ev.target as HTMLElement, delegateSelector, contentRef.current);
        if (c) {
          operationRef.current = "drag"; resizeSideRef.current = null;
          draggableElRef.current = c;
          const { tx, ty } = parseTransform(c);
          startRef.current.tx = tx; startRef.current.ty = ty;
          isPointerDragging = true; thresholdExceeded = false;
          ev.preventDefault(); return;
        }
      }
      pointerIdRef.current = null;
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (!isPointerDragging || pointerIdRef.current !== ev.pointerId) return;
      const dx = ev.clientX - startRef.current.x;
      const dy = ev.clientY - startRef.current.y;
      const op = operationRef.current;

      if (!thresholdExceeded && op === "drag") {
        if (Math.hypot(dx, dy) > 6) {
          thresholdExceeded = true;
          try { wrapper.setPointerCapture(ev.pointerId); } catch {}
          if (draggableElRef.current) {
            try { draggableElRef.current.setAttribute("data-dragging", "true"); } catch {}
          }
        } else return;
      }

      if (op === "drag") {
        const el = draggableElRef.current;
        if (el) {
          const nx = Math.round(startRef.current.tx + dx), ny = Math.round(startRef.current.ty + dy);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            el.style.transform = `translate(${nx}px, ${ny}px)`;
            onChange?.({ x: nx, y: ny, width: state.width, height: state.height });
          });
          return;
        }
        const next = { x: state.x + dx, y: state.y + dy };
        startRef.current.x = ev.clientX; startRef.current.y = ev.clientY;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setState((s) => ({ ...s, x: next.x, y: next.y }));
          onChange?.({ x: next.x, y: next.y, width: state.width, height: state.height });
        });
        return;
      }

      if (op === "resize") {
        const el = draggableElRef.current;
        if (el) {
          const isBR = resizeSideRef.current === "br";
          let nw = Math.max(minWidth, Math.round(startRef.current.w + (isBR ? dx : -dx)));
          let nh = Math.max(minHeight, Math.round(startRef.current.h + dy));
          if (aspectLock && startRef.current.w > 0 && startRef.current.h > 0) {
            const a = startRef.current.w / startRef.current.h;
            const ah = Math.round(nw / a);
            startRef.current.h = ah; nh = ah;
          }
          const ntx = isBR ? startRef.current.tx : Math.round(startRef.current.tx + dx);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            el.style.width = nw + "px"; el.style.height = nh + "px";
            try { el.setAttribute("data-resizing", ""); } catch {}
            if (!isBR) {
              el.style.transform = `translate(${ntx}px, ${startRef.current.ty}px)`;
            }

            // update baseline so next dx/dy are incremental
            startRef.current.w = nw;
            startRef.current.h = nh;
            startRef.current.tx = ntx;
            startRef.current.x = ev.clientX;
            startRef.current.y = ev.clientY;

            onChange?.({ x: ntx, y: startRef.current.ty, width: nw, height: nh });
          });
          return;
        }
        let nw = Math.max(minWidth, Math.round(startRef.current.w + dx));
        let nh = Math.max(minHeight, Math.round(startRef.current.h + dy));
        if (aspectLock && startRef.current.w > 0 && startRef.current.h > 0) {
          nh = Math.round(nw / (startRef.current.w / startRef.current.h));
        }
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setState((s) => ({ ...s, width: nw, height: nh }));
          onChange?.({ x: state.x, y: state.y, width: nw, height: nh });
        });
      }
    };

    const cleanupPointer = () => {
      if (!isPointerDragging) return;
      isPointerDragging = false;
      const lastOp = operationRef.current, dEl = draggableElRef.current;
      if (dEl) {
        persistDelegated(id, dEl, lastOp, startRef.current.w, startRef.current.h);
      } else if (!delegate) {
        persistWrapper(id, state.x, state.y, state.width, state.height);
      }
      void animateResizeEnd({
        draggableEl: dEl, wrapper, content: contentRef.current,
        lastOperation: lastOp,
        startW: startRef.current.w, startH: startRef.current.h,
        startTx: startRef.current.tx, startTy: startRef.current.ty,
        stateX: state.x, stateY: state.y,
        stateWidth: state.width, stateHeight: state.height,
        prefersReducedMotion,
      });
      if (dEl) {
        try { dEl.removeAttribute("data-dragging"); } catch {}
        try { dEl.removeAttribute("data-resizing"); } catch {}
      }
      operationRef.current = null; pointerIdRef.current = null;
      draggableElRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lastOp === "resize") {
        onEnd?.({ x: startRef.current.tx, y: startRef.current.ty, width: startRef.current.w, height: startRef.current.h });
      } else {
        onEnd?.({ x: state.x, y: state.y, width: state.width, height: state.height });
      }
    };

    wrapper.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", cleanupPointer);
    window.addEventListener("pointercancel", cleanupPointer);
    return () => {
      wrapper.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", cleanupPointer);
      window.removeEventListener("pointercancel", cleanupPointer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (observer) observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minWidth, minHeight, aspectLock, id, delegate, delegateSelector, onChange, onEnd, state.x, state.y, state.width, state.height]);
}
