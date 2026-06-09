import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={`h-11 w-full rounded-2xl border border-[#28241C] bg-[#15130F] px-4 text-sm text-[#F4EBDD] outline-none transition focus:border-[#5C4724] focus:ring-2 focus:ring-[#C8A96E]/15 disabled:cursor-not-allowed disabled:text-[#6F6A63] ${className}`}
      {...props}
    />
  );
}
