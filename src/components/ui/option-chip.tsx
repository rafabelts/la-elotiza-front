import type { ButtonHTMLAttributes } from "react";

export type OptionChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  selected: boolean;
};

export function OptionChip({ selected, className = "", type = "button", ...props }: OptionChipProps) {
  return (
    <button
      {...props}
      type={type}
      aria-pressed={selected}
      className={`ui-option-chip ${selected ? "ui-option-chip--selected" : ""} ${className}`.trim()}
    />
  );
}
