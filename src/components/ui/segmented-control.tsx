"use client";

export type SegmentItem<Value extends string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

export type SegmentedControlProps<Value extends string> = {
  label: string;
  items: readonly SegmentItem<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  className?: string;
};

export function SegmentedControl<Value extends string>({ label, items, value, onValueChange, className = "" }: SegmentedControlProps<Value>) {
  return (
    <div role="group" aria-label={label} className={`ui-segmented ${className}`.trim()}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={item.disabled}
          aria-pressed={item.value === value}
          onClick={() => onValueChange(item.value)}
          className={`ui-segmented__button ${item.value === value ? "ui-segmented__button--active" : ""}`.trim()}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
