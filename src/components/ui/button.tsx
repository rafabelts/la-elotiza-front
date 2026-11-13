import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "brand" | "ink" | "outline" | "ghost" | "danger";
  size?: "default" | "large";
};

export function Button({
  variant = "brand",
  size = "default",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`ui-button ui-button--${variant} ui-button--${size} ${className}`.trim()}
    />
  );
}
