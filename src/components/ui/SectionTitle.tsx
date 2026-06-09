import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
  index?: string;
  eyebrow?: string;
};

export function SectionTitle({ children, eyebrow, index }: SectionTitleProps) {
  return (
    <div className="border-b border-[#28241C] pb-4">
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#6F6A63]">
          {eyebrow}
        </p>
      ) : null}
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#C8A96E]">
        {index ? `${index} / ` : ""}
        {children}
      </p>
    </div>
  );
}
