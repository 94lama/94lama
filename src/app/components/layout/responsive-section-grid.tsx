type ResponsiveSectionGridProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "balanced" | "contact";
};

const variantClassNames = {
  balanced: "grid gap-6 md:gap-7 xl:grid-cols-2",
  contact: "grid gap-6 md:gap-7 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]",
} as const;

export function ResponsiveSectionGrid({
  children,
  className,
  variant = "balanced",
}: Readonly<ResponsiveSectionGridProps>) {
  const baseClassName = variantClassNames[variant];

  return <section className={className ? `${baseClassName} ${className}` : baseClassName}>{children}</section>;
}
