const sectionSurfaceMotionClassName =
  "motion-surface transition-[border-color,background-color,box-shadow] duration-300 ease-out will-change-transform";

export const sectionControlMotionClassName =
  "motion-control transition-[border-color,background-color,color,box-shadow] duration-200 ease-out will-change-transform";

export const sectionRevealClassName = "motion-reveal";

export const sectionRevealQuickClassName = "motion-reveal-quick";

export const sectionRevealDelayClassName = "motion-reveal-delay";

export const sectionPanelClassName =
  `relative rounded-4xl ${sectionSurfaceMotionClassName}`;

export const sectionCardClassName =
  `rounded-[1.5rem] border border-black/10 bg-white/72 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.22)] backdrop-blur-sm ${sectionSurfaceMotionClassName} dark:border-white/10 dark:bg-white/4 dark:shadow-none`;

export const sectionEyebrowToneClassName = "text-slate-500 dark:text-white/42";

export const sectionBodyToneClassName = "text-slate-600 dark:text-white/72";

export const sectionTitleToneClassName = "text-slate-950 dark:text-white";

export const sectionChipClassName =
  `rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-600 ${sectionControlMotionClassName} dark:border-white/12 dark:bg-white/6 dark:text-white/62`;

export const sectionPillClassName =
  `rounded-full border border-black/10 bg-white/80 px-4 py-3 text-sm text-slate-700 backdrop-blur-sm ${sectionControlMotionClassName} dark:border-white/12 dark:bg-white/6 dark:text-white/78`;

export const sectionPrimaryActionClassName =
  `inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground shadow-[0_18px_40px_-28px_rgba(37,99,235,0.7)] ${sectionControlMotionClassName} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`;

export const sectionContinuityShellClassName =
  "transition-[opacity,transform,border-color,background-color,box-shadow,filter] duration-450 ease-out";

export const sectionContinuityPendingClassName =
  "opacity-80 saturate-[0.96]";

export const sectionSkeletonBlockClassName =
  "rounded-2xl bg-black/7 dark:bg-white/8";
