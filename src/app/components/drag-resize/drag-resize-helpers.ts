const STORAGE_VERSION = 1;

export function getStorageKey(id?: string) {
  return id ? `rework:layout:${id}` : undefined;
}

// CSS stylesheet injected once into <head>
let styleInjected = false;
export function injectDragResizeStyles() {
  if (typeof document === "undefined" || styleInjected) return;
  const style = document.createElement("style");
  style.id = "drag-resize-styles";
  style.innerHTML = `
    [data-draggable-item]{ cursor: grab; user-select: none; -webkit-user-select: none; touch-action: none; position: relative; }
    [data-draggable-item][data-dragging]{ cursor: grabbing; }
    [data-draggable-item] [data-delegate-resize-handle] {
      position: absolute; right: 8px; bottom: 8px; width: 22px; height: 22px;
      border-radius: 6px; background: rgba(0,0,0,0.12);
      border: 1px solid rgba(255,255,255,0.06);
      box-shadow: 0 6px 18px rgba(2,6,23,0.12);
      opacity: 0; transition: opacity 140ms ease, transform 140ms ease;
      transform: translateY(6px); z-index: 9999;
      cursor: nwse-resize; pointer-events: auto;
    }
    [data-draggable-item]:hover [data-delegate-resize-handle] { opacity:1; transform: translateY(0); }
    [data-draggable-item][data-resizing] { background: rgba(59,130,246,0.08) !important; }
    @media (prefers-color-scheme: dark) {
      [data-draggable-item] [data-delegate-resize-handle] {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(0,0,0,0.06);
        box-shadow: 0 6px 18px rgba(0,0,0,0.5);
      }
      [data-draggable-item]:hover [data-delegate-resize-handle] { opacity:1; }
    }
  `;
  document.head.appendChild(style);
  styleInjected = true;
}

// Inject resize handles into delegate items, return MutationObserver for cleanup
export function createDelegateHandles(
  container: HTMLElement,
  selector: string,
): MutationObserver | null {
  const addHandles = () => {
    try {
      container.querySelectorAll(selector).forEach((n) => {
        const el = n as HTMLElement;
        if (el.querySelector("[data-delegate-resize-handle]")) return;
        const h = document.createElement("div");
        h.setAttribute("data-delegate-resize-handle", "");
        h.setAttribute("aria-hidden", "true");
        const s = h.style;
        s.position = "absolute"; s.right = "8px"; s.bottom = "8px";
        s.width = "22px"; s.height = "22px"; s.borderRadius = "6px";
        s.background = "rgba(0,0,0,0.12)";
        s.border = "1px solid rgba(255,255,255,0.06)";  
        s.boxShadow = "0 6px 18px rgba(2,6,23,0.12)";
        s.opacity = "0"; s.transform = "translateY(6px)";
        s.transition = "opacity 140ms ease, transform 140ms ease";
        s.cursor = "nwse-resize"; s.zIndex = "9999"; s.pointerEvents = "auto";
        if (window.getComputedStyle(el).position === "static") el.style.position = "relative";
        el.appendChild(h);
      });
    } catch { /* ignore */ }
  };
  addHandles();
  try {
    const mo = new MutationObserver(() => addHandles());
    mo.observe(container, { childList: true, subtree: true });
    return mo;
  } catch { return null; }
}

// Parse translateX / translateY from computed transform matrix
export function parseTransform(el: HTMLElement): { tx: number; ty: number } {
  const tr = window.getComputedStyle(el).transform || "";
  const m2 = tr.match(/^matrix\(([-0-9., ]+)\)$/);
  const m3 = tr.match(/^matrix3d\(([-0-9., ]+)\)$/);
  let tx = 0, ty = 0;
  if (m2) {
    const p = m2[1].split(",").map((s) => parseFloat(s));
    tx = p[4] || 0; ty = p[5] || 0;
  } else if (m3) {
    const p = m3[1].split(",").map((s) => parseFloat(s));
    tx = p[12] || 0; ty = p[13] || 0;
  }
  return { tx, ty };
}

// Find delegate candidate element inside contentRef
export function findCandidate(
  target: HTMLElement,
  selector: string | undefined,
  contentRef: HTMLElement,
): HTMLElement | null {
  let c: HTMLElement | null = null;
  if (selector) c = target.closest(selector) as HTMLElement | null;
  if (c && !contentRef.contains(c)) c = null;
  if (!c) {
    let el: HTMLElement | null = target;
    while (el && el !== contentRef && el.parentElement !== contentRef) el = el.parentElement;
    if (el && el.parentElement === contentRef) c = el;
  }
  return c;
}

// Persist delegated element layout to localStorage  
export function persistDelegated(
  id: string | undefined,
  el: HTMLElement,
  operation: "drag" | "resize" | null,
  w: number,
  h: number,
) {
  const key = getStorageKey(id ? `${id}:${el.dataset.draggableId ?? el.id ?? el.className}` : undefined);
  if (!key) return;
  try {
    const tr = window.getComputedStyle(el).transform || "";
    const data = operation === "resize"
      ? { version: STORAGE_VERSION, width: w, height: h, transform: tr }
      : { version: STORAGE_VERSION, transform: tr };
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
}

// Persist wrapper layout to localStorage
export function persistWrapper(
  id: string | undefined,
  x: number, y: number,
  width: number | undefined, height: number | undefined,
) {
  const key = getStorageKey(id);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, x, y, width, height }));
  } catch { /* ignore */ }
}

// Convert delegate children to position:absolute while preserving visual position
export function absolutizeDelegateItems(container: HTMLElement, selector: string) {
  try {
    const parentRect = container.getBoundingClientRect();
    const nodes = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    nodes.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // compute offsets relative to container
      const left = Math.round(rect.left - parentRect.left);
      const top = Math.round(rect.top - parentRect.top);
      // apply inline styles to preserve size/position
      el.style.position = "absolute";
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.width = `${Math.round(rect.width)}px`;
      el.style.height = `${Math.round(rect.height)}px`;
      // ensure transform baseline
      el.style.transform = el.style.transform || "translate(0px, 0px)";
    });
  } catch (err) {
    // ignore
  }
}

// Center delegate children exactly in container using percent transform
export function centerDelegateItems(container: HTMLElement, selector: string) {
  try {
    // ensure container is positioned so absolute children anchor to it
    const cs = window.getComputedStyle(container);
    if (cs.position === "static") container.style.position = "relative";

    const nodes = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    nodes.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      // preserve size
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      el.style.position = "absolute";
      el.style.left = `50%`;
      el.style.top = `25%`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.dataset.center = "true";
      el.style.zIndex = `${100 + i}`;
    });
  } catch (err) {
    // ignore
  }
}
