import type { CSSProperties, ReactNode } from "react";

type MarqueeRailProps<T> = {
  items: readonly T[];
  duration: string;
  gapVar: string;
  renderItem: (item: T, index: number) => ReactNode;
};

export function MarqueeRail<T>({
  items,
  duration,
  gapVar,
  renderItem,
}: MarqueeRailProps<T>) {
  const marqueeItems = [...items, ...items];
  const railStyle = {
    "--marquee-gap": `var(${gapVar})`,
    "--marquee-distance": `calc(-50% - var(${gapVar}))`,
    "--marquee-duration": duration,
  } as CSSProperties;

  return (
    <div
      className="flex w-max gap-[var(--marquee-gap)] animate-marquee motion-reduce:animate-none motion-reduce:[animation:none!important]"
      style={railStyle}
    >
      {marqueeItems.map((item, index) => renderItem(item, index))}
    </div>
  );
}