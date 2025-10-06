import type { ComponentPropsWithoutRef } from "react";

const baseClassNames = "inline-flex items-center justify-center gap-[var(--spacing-4)] rounded-[var(--radius-pill)] px-[var(--spacing-10)] py-[var(--spacing-7)] title-medium text-on-primary elevation-level2 transition ease-[var(--easing-emphasized)] focus-visible:outline focus-visible:outline-[var(--spacing-1)] focus-visible:outline-offset-[var(--spacing-2)] focus-visible:outline-primary";
const enabledClassNames = "cursor-pointer bg-primary hover:bg-inverse-primary hover:text-inverse-on-surface";
const disabledClassNames = "cursor-not-allowed bg-surface-variant text-on-surface opacity-70";

type PrimaryCtaButtonProps = ComponentPropsWithoutRef<"button">;

export function PrimaryCtaButton({ className, type = "button", disabled = false, ...rest }: PrimaryCtaButtonProps) {
  const stateClassNames = disabled ? disabledClassNames : enabledClassNames;
  const mergedClassName = [baseClassNames, stateClassNames, className].filter(Boolean).join(" ");

  return <button type={type} disabled={disabled} aria-disabled={disabled || undefined} className={mergedClassName} {...rest} />;
}