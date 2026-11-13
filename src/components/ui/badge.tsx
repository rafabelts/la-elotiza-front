import type { HTMLAttributes } from "react";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "warm" | "warning" | "ready";
};

export function Badge({ tone = "neutral", className = "", ...props }: BadgeProps) {
  return <span {...props} className={`ui-badge ui-badge--${tone} ${className}`.trim()} />;
}
