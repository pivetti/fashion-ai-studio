import type { ReactNode } from "react";

type EmptyStateProps = {
  action?: ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
};

export function EmptyState({
  action,
  description,
  eyebrow = "Sem registros",
  title,
}: EmptyStateProps) {
  return (
    <div className="rounded-[1.35rem] border border-dashed border-[#28241C] bg-[#0F0F0D] p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8C6A32]">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-display text-2xl font-semibold text-[#F4EBDD]">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#A9A096]">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
