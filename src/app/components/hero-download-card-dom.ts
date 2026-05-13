const STYLE_PROPS = [
  "color", "background", "background-color", "background-image",
  "background-size", "background-position", "background-repeat",
  "border", "border-color", "border-top-color", "border-bottom-color",
  "border-left-color", "border-right-color", "border-radius",
  "border-style", "border-width", "border-top-width", "border-bottom-width",
  "border-left-width", "border-right-width", "box-shadow", "text-shadow",
  "font-family", "font-size", "font-weight", "font-style", "line-height",
  "letter-spacing", "text-transform", "text-decoration", "text-decoration-color",
  "text-align", "white-space", "word-break", "display", "position", "top",
  "right", "bottom", "left", "width", "height", "min-width", "min-height",
  "max-width", "max-height", "margin", "margin-top", "margin-right",
  "margin-bottom", "margin-left", "padding", "padding-top", "padding-right",
  "padding-bottom", "padding-left", "flex", "flex-direction", "flex-wrap",
  "align-items", "align-self", "justify-content", "justify-items", "justify-self",
  "gap", "row-gap", "column-gap", "grid", "grid-template-columns",
  "grid-template-rows", "grid-column", "grid-row", "overflow", "overflow-x",
  "overflow-y", "opacity", "visibility", "z-index", "transform",
  "transform-origin", "cursor", "pointer-events", "object-fit", "object-position",
  "outline", "outline-color", "outline-style", "outline-width", "text-overflow",
  "backdrop-filter", "-webkit-backdrop-filter",
] as const;

const COLOR_PROPS = [
  "background-color", "background-image", "border-top-color", "border-right-color",
  "border-bottom-color", "border-left-color", "box-shadow", "color",
  "list-style-image", "text-decoration-color", "text-shadow",
  "-webkit-text-stroke-color",
] as const;

const SKIP = new Set([
  "none", "normal", "auto", "0px", "rgba(0, 0, 0, 0)", "transparent",
  "visible", "static", "separate", "nowrap", "stretch", "start",
]);

const UNSAFE = /(?:\b(?:oklab|oklch|lab|lch|color|light-dark)\s*\()|(?:\bcolor-mix\s*\()/i;

const fallbackValue = (property: string) => {
  if (property === "background" || property.includes("image") || property.includes("shadow")) return "none";
  if (property.includes("color")) return "rgba(0, 0, 0, 0)";
  return "";
};

const createProbe = (doc: Document) => {
  const probe = doc.createElement("div");
  probe.style.cssText = "position:fixed;left:-9999px;top:0;pointer-events:none;opacity:0;";
  doc.body.appendChild(probe);
  return probe;
};

const normalize = (probe: HTMLDivElement, property: string, value: string) => {
  if (!UNSAFE.test(value)) return value;
  probe.style.removeProperty(property);
  probe.style.setProperty(property, value);
  const resolved = getComputedStyle(probe).getPropertyValue(property).trim();
  probe.style.removeProperty(property);
  return resolved && !UNSAFE.test(resolved) ? resolved : fallbackValue(property);
};

const shouldInline = (value: string) => value.trim().length > 0 && !SKIP.has(value.trim());

export function resolveSafeStyleValue(doc: Document, property: string, value: string, fallback = "") {
  const probe = createProbe(doc);
  try {
    return normalize(probe, property, value.trim()) || fallback;
  } finally {
    probe.remove();
  }
}

export function inlineAllComputedStyles(root: HTMLElement) {
  const probe = createProbe(root.ownerDocument);
  const walk = (el: Element) => {
    if (["SCRIPT", "STYLE", "LINK", "META"].includes(el.tagName)) return;
    const htmlEl = el as HTMLElement;
    const styles = getComputedStyle(htmlEl);

    for (const property of STYLE_PROPS) {
      try {
        const value = normalize(probe, property, styles.getPropertyValue(property).trim());
        if (shouldInline(value)) htmlEl.style.setProperty(property, value);
      } catch {}
    }

    htmlEl.style.fontFamily = "system-ui, -apple-system, sans-serif";
    htmlEl.style.animation = "none";
    htmlEl.style.transition = "none";
    htmlEl.removeAttribute("class");
    Array.from(el.children).forEach(walk);
  };

  try {
    walk(root);
  } finally {
    probe.remove();
  }
}

export function sanitizeUnsupportedColorStyles(root: HTMLElement) {
  const probe = createProbe(root.ownerDocument);
  const walk = (el: Element) => {
    const htmlEl = el as HTMLElement;
    const styles = getComputedStyle(htmlEl);

    for (const property of COLOR_PROPS) {
      const value = styles.getPropertyValue(property).trim();
      if (!UNSAFE.test(value)) continue;
      const safe = normalize(probe, property, value);
      if (safe) htmlEl.style.setProperty(property, safe);
      else htmlEl.style.removeProperty(property);
    }

    for (let i = htmlEl.style.length - 1; i >= 0; i -= 1) {
      const property = htmlEl.style.item(i);
      const value = htmlEl.style.getPropertyValue(property).trim();
      if (!UNSAFE.test(value)) continue;
      const safe = normalize(probe, property, value);
      if (safe) htmlEl.style.setProperty(property, safe);
      else htmlEl.style.removeProperty(property);
    }

    Array.from(el.children).forEach(walk);
  };

  try {
    walk(root);
  } finally {
    probe.remove();
  }
}

export function stripDragChrome(root: HTMLElement) {
  root.querySelectorAll("[data-draggable-item]").forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.border = "none";
    htmlEl.style.boxShadow = "none";
    htmlEl.style.backdropFilter = "none";
    htmlEl.style.removeProperty("-webkit-backdrop-filter");
  });
  root.querySelectorAll("[data-delegate-resize-handle]").forEach((el) => el.remove());
}

export function stripPdfBorders(root: HTMLElement) {
  [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))].forEach((el) => {
    el.style.border = "none";
    el.style.borderTop = "none";
    el.style.borderRight = "none";
    el.style.borderBottom = "none";
    el.style.borderLeft = "none";
    el.style.borderColor = "transparent";
    el.style.outline = "none";
    el.style.boxShadow = "none";
  });
}

export function removeDocumentStyles(doc: Document) {
  doc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => node.remove());
}

export function replaceInlineSvgWithImages(root: HTMLElement) {
  root.querySelectorAll("svg").forEach((svg) => {
    const rect = svg.getBoundingClientRect();
    const img = root.ownerDocument.createElement("img");
    const clone = svg.cloneNode(true) as SVGElement;
    const styles = getComputedStyle(svg);

    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    if (!clone.getAttribute("width") && rect.width) clone.setAttribute("width", `${Math.ceil(rect.width)}`);
    if (!clone.getAttribute("height") && rect.height) clone.setAttribute("height", `${Math.ceil(rect.height)}`);

    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
    img.alt = "";
    img.decoding = "sync";
    img.style.display = styles.display;
    img.style.width = styles.width;
    img.style.height = styles.height;
    img.style.verticalAlign = styles.verticalAlign;
    svg.replaceWith(img);
  });
}
