import type { HTMLAttributes, ReactNode } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: "gold" | "green" | "red" | "neutral" | "studio";
};

export function Badge({
  children,
  className = "",
  tone = "gold",
  ...props
}: BadgeProps) {
  const tones = {
    gold: "border-[#5C4724] bg-[#C8A96E]/10 text-[#E3C98A]",
    green: "border-emerald-500/25 bg-emerald-950/35 text-emerald-200",
    red: "border-red-500/30 bg-red-950/35 text-red-200",
    neutral: "border-[#28241C] bg-[#15130F] text-[#A9A096]",
    studio: "border-[#28241C] bg-[#0F0F0D] text-[#F4EBDD]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold leading-none ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
