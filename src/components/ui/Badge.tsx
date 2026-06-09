import type { HTMLAttributes, ReactNode } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: "gold" | "green" | "red" | "neutral";
};

export function Badge({
  children,
  className = "",
  tone = "gold",
  ...props
}: BadgeProps) {
  const tones = {
    gold: "border-[#C8A96E]/35 bg-[#C8A96E]/10 text-[#C8A96E]",
    green: "border-emerald-400/30 bg-emerald-950/40 text-emerald-200",
    red: "border-red-400/30 bg-red-950/40 text-red-200",
    neutral: "border-[#333] bg-[#0d0d0d] text-[#888]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
