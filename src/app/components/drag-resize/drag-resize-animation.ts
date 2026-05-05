type AnimationContext = {
  draggableEl: HTMLElement | null;
  wrapper: HTMLElement | null;
  content: HTMLElement | null;
  lastOperation: "drag" | "resize" | null;
  startW: number;
  startH: number;
  startTx: number;
  startTy: number;
  stateX: number;
  stateY: number;
  stateWidth?: number;
  stateHeight?: number;
  prefersReducedMotion: boolean;
};

// Apply final styles (reduced motion path)
function applyFinalStyles(ctx: AnimationContext) {
  const el = ctx.draggableEl;
  if (el) {
    if (ctx.lastOperation === "resize") {
      el.style.width = ctx.startW + "px";
      el.style.height = ctx.startH + "px";
      el.style.transform = `translate(${ctx.startTx}px, ${ctx.startTy}px)`;
    }
  } else {
    if (ctx.wrapper) ctx.wrapper.style.transform = `translate(${ctx.stateX}px, ${ctx.stateY}px)`;
    if (ctx.content) {
      if (ctx.stateWidth !== undefined) ctx.content.style.width = ctx.stateWidth + "px";
      if (ctx.stateHeight !== undefined) ctx.content.style.height = ctx.stateHeight + "px";
    }
  }
}

// Animate via animejs (dynamic import), fall back to instant apply
export async function animateResizeEnd(ctx: AnimationContext) {
  if (ctx.prefersReducedMotion) { applyFinalStyles(ctx); return; }

  try {
    const mod = await import("animejs");
    const animator = (mod as any).default ?? (mod as any);
    if (!animator) { applyFinalStyles(ctx); return; }

    const el = ctx.draggableEl;
    if (el) {
      if (ctx.lastOperation === "resize") {
        animator({
          targets: el, width: ctx.startW, height: ctx.startH,
          translateX: ctx.startTx, translateY: ctx.startTy,
          duration: 360, easing: "cubicBezier(.2,.9,.3,1)",
        });
      } else {
        animator({
          targets: el,
          translateX: ctx.startTx, translateY: ctx.startTy,
          duration: 360, easing: "cubicBezier(.2,.9,.3,1)",
        });
      }
    } else if (ctx.wrapper) {
      animator({
        targets: ctx.wrapper,
        translateX: ctx.stateX, translateY: ctx.stateY,
        duration: 360, easing: "cubicBezier(.2,.9,.3,1)",
      });
      if (ctx.content) {
        animator({
          targets: ctx.content,
          width: ctx.stateWidth, height: ctx.stateHeight,
          duration: 360, easing: "cubicBezier(.2,.9,.3,1)",
        });
      }
    }
  } catch {
    applyFinalStyles(ctx);
  }
}
