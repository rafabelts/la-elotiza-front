"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./button";

export type DialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
};

export function Dialog({ open, title, onClose, children, className = "", closeLabel = "Cerrar" }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      previousFocusRef.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={() => {
        previousFocusRef.current?.focus();
        onClose();
      }}
      className={`ui-dialog ${className}`.trim()}
    >
      <div className="ui-dialog__heading">
        <h2 id={titleId} className="ui-dialog__title">{title}</h2>
        <Button variant="ghost" className="ui-dialog__close" onClick={() => dialogRef.current?.close()} aria-label={closeLabel}>×</Button>
      </div>
      {children}
    </dialog>
  );
}
