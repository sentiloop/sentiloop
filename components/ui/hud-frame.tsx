import type { CSSProperties, ReactNode } from "react";

interface HUDFrameProps {
  children: ReactNode;
  label: string;
  index: string;
  accent: string;
  className?: string;
}

export function HUDFrame({ children, label, index, accent, className = "" }: HUDFrameProps) {
  return (
    <div
      className={`hud-frame relative overflow-hidden rounded-[20px] ${className}`}
      style={{ "--hud-accent": accent } as CSSProperties}
    >
      <div className="hud-frame-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hud-frame-scan pointer-events-none absolute inset-y-0 left-0 w-px" aria-hidden="true" />
      <span className="hud-frame-corner hud-frame-corner-tl" aria-hidden="true" />
      <span className="hud-frame-corner hud-frame-corner-br" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="hud-frame-meta flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.16em]">
          <span>{label}</span>
          <span className="inline-flex items-center gap-1.5"><span className="hud-frame-dot size-1 rounded-full" />{index}</span>
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
