import type { ReactNode } from "react";

type PreviewFrameProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

export function PreviewFrame({
  children,
  className = "",
  label,
}: PreviewFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.35rem] border border-[#28241C] bg-[#080807] ${className}`}
    >
      {label ? (
        <div className="flex items-center justify-between border-b border-[#28241C] px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6F6A63]">
            {label}
          </span>
          <span className="h-2 w-2 rounded-full bg-[#C8A96E]" />
        </div>
      ) : null}
      {children}
    </div>
  );
}
