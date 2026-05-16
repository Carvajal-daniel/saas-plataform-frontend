import * as React from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative z-10 w-full max-w-lg rounded-2xl bg-card/90 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20";
