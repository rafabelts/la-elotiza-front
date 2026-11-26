"use client";

export type QuantityStepperProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
};

export function QuantityStepper({ label, value, min = 1, max, onChange, className = "" }: QuantityStepperProps) {
  return (
    <div role="group" aria-label={label} className={`ui-stepper ${className}`.trim()}>
      <button type="button" className="ui-stepper__button" aria-label={`Disminuir ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
      <output className="ui-stepper__value" aria-live="polite" aria-label={`${label}: ${value}`}>{value}</output>
      <button type="button" className="ui-stepper__button" aria-label={`Aumentar ${label}`} disabled={max !== undefined && value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
