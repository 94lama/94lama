export const pageRhythm = {
  shell: "mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-4 sm:gap-14 sm:px-6 sm:py-6 lg:gap-20 lg:px-8 lg:py-8 xl:gap-24 xl:px-10 xl:py-10",
  heroToProof: "space-y-8 sm:space-y-10 lg:space-y-12",
  proofBlock: "flex flex-col gap-10 px-0 py-0 sm:gap-12",
  supportingBlock: "gap-6 sm:gap-7 lg:gap-8",
  supportingGrid: {
    balanced: "grid gap-6 md:gap-7 xl:grid-cols-2",
    contact: "grid gap-6 md:gap-7 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]",
  },
} as const;

export const sectionRhythm = {
  comfortable: {
    shell: "px-5 py-6 sm:px-6 sm:py-7 xl:px-8 xl:py-8",
    inner: "px-4 py-4 sm:px-5 sm:py-5",
    stack: "space-y-6 sm:space-y-7",
  },
  compact: {
    shell: "px-5 py-5 sm:px-6 sm:py-6 xl:px-7 xl:py-7",
    inner: "px-4 py-3 sm:px-5 sm:py-4",
    stack: "space-y-5 sm:space-y-6",
  },
} as const;
