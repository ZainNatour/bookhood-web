import type { ComponentPropsWithoutRef } from "react";

type StarRatingProps = {
  count?: number;
  ariaLabel?: string;
} & ComponentPropsWithoutRef<"div">;

export function StarRating({
  count = 5,
  ariaLabel = "Rated five out of five",
  className,
  ...rest
}: StarRatingProps) {
  const baseClassName = "flex items-center gap-[var(--spacing-3)] text-warning";
  const containerClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <div className={containerClassName} role="img" aria-label={ariaLabel} {...rest}>
      {Array.from({ length: count }).map((_, index) => (
        <svg
          key={`rating-star-${index}`}
          className="h-[var(--spacing-7)] w-[var(--spacing-7)] fill-current"
          viewBox="0 0 20 20"
          focusable="false"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.122 3.45a1 1 0 00.95.69h3.63c.969 0 1.371 1.24.588 1.81l-2.938 2.135a1 1 0 00-.364 1.118l1.123 3.449c.3.921-.755 1.688-1.54 1.118l-2.939-2.135a1 1 0 00-1.175 0l-2.939 2.135c-.784.57-1.838-.197-1.539-1.118l1.122-3.449a1 1 0 00-.363-1.118L2.76 8.877c-.783-.57-.38-1.81.588-1.81h3.63a1 1 0 00.95-.69l1.121-3.45z" />
        </svg>
      ))}
    </div>
  );
}
