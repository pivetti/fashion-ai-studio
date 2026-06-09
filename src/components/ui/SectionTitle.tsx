import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
  index?: string;
};

export function SectionTitle({ children, index }: SectionTitleProps) {
  return (
    <div className="border-b border-[#1e1e1e] pb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C8A96E]">
        {index ? `${index} - ` : ""}
        {children}
      </p>
    </div>
  );
}
