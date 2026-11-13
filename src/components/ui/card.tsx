import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article";
};

export function Card({ as: Element = "div", className = "", ...props }: CardProps) {
  return <Element {...props} className={`ui-card ${className}`.trim()} />;
}
