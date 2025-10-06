import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function Container({ className, children }: ContainerProps) {
  const baseClassName =
    "mx-auto w-full max-w-[var(--container-max-2xl)] px-[var(--container-padding-sm)] sm:px-[var(--container-padding-md)] lg:px-[var(--container-padding-lg)]";
  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return <div className={composedClassName}>{children}</div>;
}