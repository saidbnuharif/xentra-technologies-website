export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-md font-medium transition-colors duration-200 [&_svg]:shrink-0";

const variants: Record<ButtonVariant, string> = {
  // Electric blue: reserved for the single most important action in view.
  primary: "bg-blue-500 text-white hover:bg-blue-600 border border-blue-500 hover:border-blue-600",
  // Clearly bordered on both dark and light tones (was 8% white — too faint).
  secondary: "border border-fg/30 text-fg hover:border-fg/70 hover:bg-fg/5",
  // Text link with arrow, for low-emphasis navigation.
  ghost: "text-fg hover:text-accent px-0!",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-base",
};

/** Shared button classes so links and WhatsApp CTAs look identical. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "lg",
  extra = "",
): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}
